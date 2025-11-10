#!/bin/bash

blink_card_plugin_path=`pwd`/BlinkCard
appName=BlinkCardSample
appId=com.microblink.sample
rn_version="0.82.0"

# remove any existing code
rm -rf $appName

# create a sample application
# https://github.com/react-native-community/cli#using-npx-recommended
npx @react-native-community/cli init $appName --package-name $appId --title "BlinkCard React-Native Sample" --version "$rn_version" || exit 1

# enter into demo project folder
pushd $appName || exit 1

# Inject esModuleInterop into tsconfig.json
# Add "esModuleInterop": true into compilerOptions in tsconfig.json
sed -i '' '/"compilerOptions": {/a\
\    "esModuleInterop": true,\
\    "allowSyntheticDefaultImports": true,\
\    "skipLibCheck": true,
' tsconfig.json

IS_LOCAL_BUILD=true || exit 1
if [ "$IS_LOCAL_BUILD" = true ]; then
  echo "Using blinkcard-react-native from this repo instead from NPM"
  # use directly source code from this repo instead of npm package
  # from RN 0.57 symlink does not work any more
  npm pack $blink_card_plugin_path
  npm install --save microblink-blinkcard-react-native-2.12.0.tgz
  #pushd node_modules
    #ln -s $blinkcard_plugin_path blinkcard-react-native
  #popd
else
  # download npm package
  echo "Downloading blinkcard-react-native module"
  npm install --save @microblink/blinkcard-react-native
fi

# react-native-image-picker plugin needed only for sample application with DirectAPI to get the card images
npm install react-native-image-picker

# enter into ios project folder
pushd ios || exit 1

# install pod
pod install

# if [ "$IS_LOCAL_BUILD" = true ]; then
  # echo "Replace pod with custom dev version of BlinkID framework"
  # replace pod with custom dev version of BlinkID framework
  # pushd Pods/PPBlinkID || exit 1
  # rm -rf Microblink.bundle
  # rm -rf Microblink.framework
  # cp -r ~/Downloads/blinkid-ios/Microblink.framework ./
  # popd
# fi

# Add the camera and photo usage descriptions into Info.plist to enable camera scanning and the image upload via gallery
sed -i '' '/<dict>/a\
  <key>NSCameraUsageDescription</key>\
  <string>Enable the camera usage for BlinkCard default UX scanning</string>\
  <key>NSPhotoLibraryUsageDescription</key>\
  <string>Enable photo gallery usage for BlinkCard DirectAPI scanning</string>\
' $appName/Info.plist


#Disable Flipper since it spams console with errors
export NO_FLIPPER=1

pod install

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

# return to root folder
popd

echo "
Instruction for running the $appName sample application:
 
Go to the React Native project folder: cd $appName

----- Android instructions -----

Execute: npx react-native run-android

----- iOS instructions -----

1. Execute npx react-native start
2. Open $appName/ios/$appName.xcworkspace
3. Set your development team
4. Press run
"
