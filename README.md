# BlinkCard SDK wrapper for React Native

Best-in-class credit card scanning software for cross-platform apps built with React Native.

Below, you’ll find a quick guide on starting your own demo project as well as complete guidance on installing and linking BlinkCard library with your iOS and Android apps ⬇️

For a full access to all features and functionalities, please consider using our native SDKs (for [iOS](https://github.com/BlinkCard/blinkcard-ios) or [Android](https://github.com/BlinkCard/blinkcard-android))


## Licensing

- A valid license key is required to initialize scanning. You can request a **free trial license key**, after you register, at [Microblink Developer Hub](https://account.microblink.com/signin)

- For production licensing, please [contact sales](https://microblink.com/contact-us) to request a quote.

**Keep in mind:** Versions 2.2.0 and above require an internet connection to work under our new License Management Program.

We’re only asking you to do this so we can validate your trial license key. Scanning or data extraction of identity documents still happens offline, on the device itself. 

Once the validation is complete, you can continue using the SDK in offline mode (or over a private network) until the next check.


## React Native Version

BlinkCard React Native was built and tested with [React Native v0.64.0](https://github.com/facebook/react-native/releases/tag/v0.64.0)

## Installation

First generate an empty project if needed:

```shell
react-native init --version="0.64.0" NameOfYourProject
```

Add the **blinkcard-react-native** module to your project:

```shell
cd <path_to_your_project>
npm i --save @microblink/blinkcard-react-native
```

## Linking

### iOS

Link module with your project: 

```shell
react-native link @microblink/blinkcard-react-native
```

[CocoaPods](http://cocoapods.org) is a dependency manager for Objective-C, which automates and simplifies the process of using 3rd-party libraries like BlinkCard in your projects.

Download and install/update [Cocopods version 1.10.0](https://github.com/CocoaPods/CocoaPods/releases/tag/1.10.0) or newer.

- If you wish to use version v1.4.0 or above, you need to install [Git Large File Storage](https://git-lfs.github.com) by running these comamnds:

```shell
brew install git-lfs
git lfs install
```

- **Be sure to restart your console after installing Git LFS**

#### Installing pods

From [react-native 0.60](https://facebook.github.io/react-native/blog/2019/07/03/version-60#cocoapods-by-default) CocoaPods are now part of React Native's iOS project.

Go to `NameOfYourProject/ios` folder and install Pods

```shell
pod install
```

Our `@microblink/blinkcard-react-native` depends on latest `MBBlinkCard ` pod so it will be installed automatically.

**To run iOS application, open NameOfYourProject.xcworkspace, set Your team for every Target in General settings and add Privacy - Camera Usage Description key to Your info.plist file and press run**

### Android

Add microblink maven repository to project level build.gradle:

```
allprojects {
  repositories {
    // don't forget to add maven and jcenter
    mavenLocal()
    jcenter()
    
    // ... other repositories your project needs
    
    maven { url "http://maven.microblink.com" }
  }
}
```

## Sample

This repository contains **initReactNativeSampleApp.sh** script that will create React Native project and download all of its dependencies. You can run this script with following command: 
```shell
./initReactNativeSampleApp.sh
```

## Usage

To use the module you call it in your index.android.js or index.ios.js file like in the [sample app](SampleFiles/index.js). Available recognizers and API documentation is available in [JS API files](BlinkCard).

## FAQ

**Can I create a custom UI overlay?**

Yes you can, but you will have to implement it natively for android and ios, you can see native implementation guides [here(Android)](https://github.com/BlinkCard/blinkcard-android#recognizerRunnerView) and [here(ios)](https://github.com/BlinkCard/blinkcard-ios#recognizerRunnerViewController).

## Known react-native problems:

### iOS
React native v0.62.2

** [NSURLResponse allHeaderFields]: unrecognized selector sent to instance**

Make sure to use the Flipper version 0.37.0 in your Podfile:

`versions['Flipper'] ||= '~> 0.37.0'` 

React native v0.63.0

`'event2/event-config.h' file not found`

Remove Flipper from Podfile

### Android build exception - missing `ReactSwipeRefreshLayout`

**java.lang.NoClassDefFoundError: com.facebook.react.views.swiperefresh.ReactSwipeRefreshLayout**

Add the following line to dependencies section in android/app/build.gradle:

`implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0-alpha02'`

