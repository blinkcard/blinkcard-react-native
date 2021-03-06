#!/bin/bash

blink_card_plugin_path=`pwd`/BlinkCard
appName=Sample

# remove any existing code
rm -rf $appName

# create a sample application
# https://github.com/react-native-community/cli#using-npx-recommended
npx react-native init $appName --version="0.64.0" || exit 1

# enter into demo project folder
pushd $appName || exit 1

IS_LOCAL_BUILD=false || exit 1
if [ "$IS_LOCAL_BUILD" = true ]; then
  echo "Using blinkcard-react-native from this repo instead from NPM"
  # use directly source code from this repo instead of npm package
  # from RN 0.57 symlink does not work any more
  npm pack $blink_card_plugin_path
  npm install --save microblink-blinkcard-react-native-2.6.0.tgz
  #pushd node_modules
    #ln -s $blinkcard_plugin_path blinkcard-react-native
  #popd
else
  # download npm package
  echo "Downloading blinkcard-react-native module"
  npm install --save @microblink/blinkcard-react-native
fi

# Auto-linking is done in 0.6 versions

# enter into android project folder
pushd android || exit 1

# patch the build.gradle to add "maven { url https://maven.microblink.com }"" repository
perl -i~ -pe "BEGIN{$/ = undef;} s/maven \{/maven \{ url 'https:\\/\\/maven.microblink.com' }\n        maven {/" build.gradle

# change package name
# adb uninstall "com.microblink.sample" 
mkdir -p app/src/main/java/com/microblink/sample
mkdir -p app/src/debug/java/com/microblink/sample
mv app/src/main/java/com/sample/* app/src/main/java/com/microblink/sample/
mv app/src/debug/java/com/sample/* app/src/debug/java/com/microblink/sample/
rmdir app/src/main/java/com/sample
rmdir app/src/debug/java/com/sample
grep -rl com.sample . | xargs sed -i '' s/com.sample/com.microblink.sample/g
./gradlew clean

# return from android project folder
popd

# enter into ios project folder
pushd ios || exit 1

# removing flipper because it causes errors
sed -i '' 's/use_flipper!()/# use_flipper!()/' Podfile

#Force minimal iOS version
sed -i '' "s/platform :ios, '10.0'/platform :ios, '12.0'/" Podfile

# install pod
pod install

if [ "$IS_LOCAL_BUILD" = true ]; then
  echo "Replace pod with custom dev version of BlinkCard framework"
  # replace pod with custom dev version of BlinkCard framework
  pushd Pods/MBBlinkCard || exit 1
  rm -rf BlinkCard.xcframework
  cp -r ~/Downloads/blinkcard-ios/BlinkCard.xcframework ./
  popd
fi

# change bundle id
sed -i '' s/\$\(PRODUCT_BUNDLE_IDENTIFIER\)/com.microblink.sample/g $appName/Info.plist

# return from ios project folder
popd

# remove index.js
rm -f index.js

# remove index.ios.js
rm -f index.ios.js

# remove index.android.js
rm -f index.android.js

cp ../sample_files/index.js ./

# use the same index.js file for Android and iOS
cp index.js index.ios.js
cp index.js index.android.js

#update compile and target sdk versions to 31, add android:exported="true" to manifest
sed -i '' 's#compileSdkVersion = 29#compileSdkVersion = 31#g' ./android/build.gradle
sed -i '' 's#targetSdkVersion = 29#targetSdkVersion = 31#g' ./android/build.gradle
sed -i '' 's#android:name=".MainActivity"#android:name=".MainActivity" android:exported="true"#g' ./android/app/src/main/AndroidManifest.xml

# return to root folder
popd

echo "Go to React Native project folder: cd $appName"
echo "To run on Android execute: react-native run-android"
echo "To run on iOS: go to $appName/ios and open $appName.xcworkspace; set your development team and add Privacy - Camera Usage Description key to Your info.plist file and press run"
