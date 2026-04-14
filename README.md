<p align="center" >
  <img src="https://raw.githubusercontent.com/wiki/BlinkCard/BlinkCard-android/images/logo-microblink.png" alt="Microblink" title="Microblink">
</p>

# _BlinkCard_ React Native module

The BlinkCard SDK is a comprehensive solution for implementing secure card scanning on React Native. It offers powerful capabilities for capturing and analyzing a wide range of payment cards. The package consists of BlinkCard, which serves as the core module, and the BlinkCardUX package that provides a complete, ready-to-use solution with a user-friendly interface.

**Please note that, for maximum performance and full access to all features, it’s best to go with one of our native SDKs (for [iOS](https://github.com/microblink/blinkcard-ios) or [Android](https://github.com/microblink/blinkcard-android)).**

However, since the wrapper is open source, you can add the features you need on your own.

# Table of contents
- [Licensing](#licensing)
- [Requirements](#requirements)
- [Quickstart with the sample application](#quickstart-with-the-sample-application)
- [Plugin integration](#plugin-integration)
- [Plugin usage](#plugin-usage)
- [Plugin specifics](#plugin-specifics)
  - [Scanning methods](#scanning-methods)
  - [SDK loading & unloading](#sdk-loading--unloading)
  - [BlinkCard Settings](#blinkcard-settings)
  - [BlinkCard Results](#blinkcard-results)
- [NPM](#npm)
- [Additional information](#additional-information)

## <a name="licensing"></a> Licensing
A valid license key is required to initialize the BlinkCard plugin. A free trial license key can be requested after registering at the [Microblink Developer Hub](https://developer.microblink.com/).

## <a name="requirements"></a> Requirements

- BlinkCard React Native was built and tested with [React Native v0.82.1](https://github.com/facebook/react-native/releases/tag/v0.82.1)
  - The BlinkCard React Native SDK is also compatible with React Native applications running on the old architecture as it contains backward compatibility with Native Module implementation.
- For additional help with React-Native setup, view the official documentation [here](https://reactnative.dev/docs/set-up-your-environment).

**Device requirements**

The BlinkCard React Native plugin requires:
- iOS version 16.0 and above
- Android API version 24 and above

- For more detailed information about the BlinkCard Android and iOS requirements, view the native SDK documentation here ([Android](https://github.com/microblink/blinkcard-android?tab=readme-ov-file#-device-requirements) & [iOS](https://github.com/microblink/blinkcard-ios?tab=readme-ov-file#requirements)).

## <a name="quickstart-with-the-sample-application"></a> Quickstart with the sample application
The sample application demonstrates how the BlinkCard module is implemented, used and shows how to obtain the scanned results. 

It contains the implementation for:
1. The **default implementation** with the default BlinkCard UX scanning experience.
2. **Multiside DirectAPI scanning** - extracting the card information from multiple static images (from the gallery).
3. **Singleside DirectAPI scanning** - extracting the card information from a single static images (from the gallery).

To obtain and run the sample application, follow the steps below:
Make sure you have Node & Watchman installed before running the sample application:
```bash
# install Watcman
brew install watchman

# install Node
brew install node
```

**To install & run the sample application:**
1. Git clone the repository:
```bash
git clone https://github.com/microblink/blinkcard-react-native.git
```
2. Position to the obtained BlinkCard folder and run the `initBlinkCardReactNativeSample.sh` script:
```bash
cd blinkcard-react-native && ./initBlinkCardReactNativeSample.sh
```
3. After the script finishes running, position to the `BlinkCardSample` folder.

**Running the sample application on Android**

For running the sample application on Android, execute the following command:

```bash
npx react-native run-android
```

**Note:** the plugin can be run directly via Android Studio as well:

1. Execute the following command:
```bash
npx react-native start
```
2. Open the `android` folder via Android Studio in the `BlinkCardSample` folder to run the Android sample application.

**Running the sample application on iOS**

1. For running the sample application on iOS, execute the following command:
```bash
npx react-native start
```
2. Open the `BlinkCardSample.xcworkspace` located in the `ios` folder
3. Set your development team
4. Press run

## <a name="plugin-integration"></a> Plugin integration

1. To add the BlinkCard plugin to a React Native project, first create empty project if needed:
```bash
npx @react-native-community/cli init YourAppName --package-name YourPackageName --title YourAppTitle --version "React Native version"
```

3. Install the `@microblink/blinkcard-react-native` dependency:
```bash
  npm install --save @microblink/blinkcard-react-native
```

4. Android: the BlinkCard library is available on Maven Central repository.

In your project root, add `mavenCentral()` repository to the repositories list, if not already present:
```bash
repositories {
    // ... other repositories
    mavenCentral()
}
```

5. iOS: position to the `ios` folder and run `pod install` to install the iOS dependency.

## <a name="plugin-usage"></a> Plugin usage

### Minimal plugin example
```typescript
  import {
    performScan,
    BlinkCardSdkSettings,
    BlinkCardSessionSettings
  } from '@microblink/blinkcard-react-native';
    /**
     * Set your license key, depending on the platform
     */
    const licenseKey = Platform.select({
      ios: 'your-ios-license-key',
      android: 'your-android-license-key',
    });

    /**
     * Call the performScan method
     */
    const blinkCardResult = await performScan(
      // Add the BlinkCard SDK settings, with the license key
      new BlinkCardSdkSettings({ licenseKey: licenseKey }),
      // Add the BlinkCard Session settings
      new BlinkCardSessionSettings(),
    );

    // get the results
    console.log(`Cardholder name: ${blinkCardResult?.cardholderName}`);
```
### Advanced plugin integration

1. After the dependency has been added to the project, first add the necessary import:
```typescript
import {
  performScan,
  performDirectApiScan,
} from '@microblink/blinkcard-react-native';
```
2. Add the license key, for each platform, obtained from the [Developer Hub portal](https://developer.microblink.com/):
```typescript
  const blinkCardLicenseKey = Platform.select({
    ios: 'your-ios-key',
    android:
      'your-android-key',
  });
```

3. Set all of the necessary BlinkCard settings (SDK settings, session settings, and the scanning settings). If the mentioned settings are not modified, the default values will be used:

```typescript
      const sdkSettings = new BlinkCardSdkSettings({
            licenseKey: blinkCardLicenseKey
          });
      sdkSettings.downloadResources = true;

      /**
       * Create and modify the Session Settings
       */
      const sessionSettings = new BlinkCardSessionSettings();

      /**
       * Create and modify the scanning settings
       */
      const scanningSettings = new ScanningSettings();
      scanningSettings.skipImagesWithBlur = true;
      scanningSettings.tiltDetectionLevel = DetectionLevel.Mid;

      /**
       * Create and modify the liveness settings
       */
      const livenessSettings = new LivenessSettings();
      livenessSettings.enableCardHelpInHandCheck = true;
      livenessSettings.photocopyCheckStrictnessLevel = StrictnessLevel.Level5;

      /**
       * Create and modify the extraction settings
       */
      const extractionSettings = new ExtractionSettings();
      extractionSettings.extractCardholderName = true;
      extractionSettings.extractCvv = true;
      extractionSettings.extractInvalidCardNumber = false;

      /**
       * Create and modify the anonymization settings
       */
      const anonymizationSettings = new AnonymizationSettings();
      anonymizationSettings.cardholderNameAnonymizationMode =
        AnonymizationMode.ImageOnly;
      anonymizationSettings.cvvAnonymizationMode = AnonymizationMode.FullResult;
      anonymizationSettings.cardNumberAnonymizationSettings =
        new CardNumberAnonymizationSettings({
          prefixDigitsVisible: 1,
          suffixDigitsVisible: 2,
        });

      /**
       * Create and modify the cropped image settings
       */
      const croppedImageSettings = new CroppedImageSettings();
      croppedImageSettings.returnCardImage = true;

      /**
       * Place the above defined settings in the Scanning settings
       */
      scanningSettings.extractionSettings = extractionSettings;
      scanningSettings.livenessSettings = livenessSettings;
      scanningSettings.anonymizationSettings = anonymizationSettings;
      scanningSettings.croppedImageSettings = croppedImageSettings;

      /**
       * Place the Scanning settings in the Session settings
       */
      sessionSettings.scanningSettings = scanningSettings;

      /**
       * Create and modify the UX settings
       * This paramater is optional
       */
      const scanningUxSettings = new ScanningUxSettings();
      scanningUxSettings.showHelpButton = true;
      scanningUxSettings.showIntroductionAlert = false;
      scanningUxSettings.preferredCameraPosition = CameraPosition.Back;
      scanningUxSettings.allowHapticFeedback = true;
```

4. Call the appropriate scanning method (with the default UX, or DirectAPI for static images), handle the results and catch any errors:
```typescript
      const blinkCardResult = await performScan(
        sdkSettings,
        sessionSettings,
        scanningUxSettings,
      );

      console.log(`${blinkCardResult?.cardholderName}`)
```

- The whole integration process can be found in the sample app `App.tsx` file [here](https://github.com/microblink/blinkcard-react-native/blob/main/sample_files/App.tsx).
- The settings and the results that can be used with the BlinkCard module can be found in the paragraphs below, but also in the comments of each BlinkCard TS file.

## <a name="plugin-specifics"></a> Plugin specifics
The BlinkCard module implementation is located in the `src` folder [here](https://github.com/microblink/blinkcard-react-native/tree/main/BlinkCard/src), while platform-specific implementation is located in the `android` and `ios` folders.


### <a name="scanning-methods"></a> Scanning methods
Currently, the BlinkCard plugin contains the following methods: `performScan` and `performDirectApiScan`.

**The `performScan` method**

The `performScan` method launches the BlinkCard scanning process with the default UX properties.\
It takes the following parameters: 
1. BlinkCard SDK settings
2. BlinkCard Session settings
3. The optional BlinkCard scanning UX settings

**BlinkCard SDK Settings** - `BlinkCardSdkSettings`: the class that contains all of the available SDK settings. It contains settings for the license key, and how the models (that the SDK needs for the scanning process) should be obtained.

**BlinkCard Session Settings** - `BlinkCardSessionSettings`: the class that contains specific scanning configurations that define how the scanning session should behave.

**BlinkCard Scanning UX settings** - `ScanningUxSettings` - the optional class that allows customization of various aspects of the UI used during the scanning process.

- The implementation of the `performScan` method can be viewed here in the [index.tsx](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/index.tsx) file.

**The `performDirectApiScan` method**

The `performDirectApiScan` method launches the BlinkCard scanning process intended for information extraction from static images.\
It takes the following parameters: 
1. BlinkCard SDK settings
2. BlinkCard Session settings
3. The first side image string in the Base64 format
4. The optional second side image string in the Base64 format

**BlinkCard SDK Settings** - `BlinkCardSdkSettings`: the class that contains all of the available SDK settings. It contains settings for the license key, and how the models (that the SDK needs for the scanning process) should be obtained.

**BlinkCard Session Settings** - `BlinkCardSessionSettings`: the class that contains specific scanning configurations that define how the scanning session should behave.

The first image Base64 string - `String`: image that represents one side of the card. 
- This image must contain the card side where the card number (PAN) is located. 
- If this side of the card contains all of the neccessary information (e.g. CVV, cardholder name) that were set in the `ExtractionSettings`, then no second image is required.

The optional second image Base64 string - `String`: image that represents one side of the card.
- Required only if not all information specified in `ExtractionSettings` can be obtained from the first side of the card.

- The implementation of the `performDirectApiScan` method can be viewed here in the [index.tsx](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/index.tsx) file.

### <a name="sdk-loading--unloading"></a> SDK loading & unloading
The BlinkCard SDK also contains methods for loading and unloading. These methods can be called before the scanning methods described above to preload the required resources and reduce the startup time of a scanning session. They can also be used to release resources after the scanning session has finished.

**SDK loading**

The `loadSdk` method creates or retrieves the instance of the BlinkCard SDK. It initializes and loads the BlinkCard SDK if it is not already loaded.

It can be called in advance to **preload** the SDK before starting a scanning session. Doing so reduces loading time for the `performScan` and `performDirectApiScan` methods, since all resources will already be available and the license verified.

If the method is not called beforehand, it will still be automatically invoked on the native platform channels when a scan starts. However, the initial scan may take longer due to resource loading and license checks.

It takes the following parameter: [BlinkCardSdkSettings](#BlinkCard-settings), which is explained in more details below.

**SDK unloading**

The `unloadSdk` platform method terminates the BlinkCard SDK and releases all associated resources. It safely shuts down the SDK instance and frees any allocated memory.
After calling this method, you must reinitialize the SDK (by calling `loadSdk` or any of the scanning methods) before using it again.

It takes the following parameter: `deleteCachedResources`.
- If set to `true` (`false` is default), the method performs a **complete cleanup**, including deletion of all downloaded and cached SDK resources from the device.

This method is automatically called after each successful scan session.

### <a name="BlinkCard-settings"></a> BlinkCard Settings
The BlinkCard SDK contains various settings, modifying different parts of scanning process:
- BlinkCard SDK settings
- BlinkCard Session settings
- Scanning settings
- Liveness settings
- Extraction settings
- Anonymization settings
- Cropped image settings
- Scanning UX settings

1. [BlinkCard SDK settings](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/blinkCardSettings.ts#L12) - `BlinkCardSdkSettings` \
These settings are used for the initialization of the BlinkCard SDK. It contains settings for the license key, and how the models (that the SDK needs for the scanning process) should be obtained.

2. [BlinkCard Session settings](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/blinkCardSettings.ts#L95) - `BlinkCardSessionSettings`\
These settings represent the configuration settings for a scanning session.\
The class that contains specific scanning configurations that define how the scanning session should behave.

3. [Scanning settings](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/blinkCardSettings.ts#L129) - `ScanningSettings`\
These settings represent the configurable settings for scanning a card.\
This class defines various parameters and policies related to the scanning process, including image quality handling, data extraction, anonymization, and liveness detection, along with options for frame processing and image extraction.

4. [Liveness settings](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/blinkCardSettings.ts#L227) - `LivenessSettings`\
Settings for liveness detection during card scanning.\
This class defines various parameters that control the behavior of liveness detection, including thresholds for hand detection, screen and photocopy analysis, and options to skip processing certain frames based on liveness criteria.

5. [Extraction settings](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/blinkCardSettings.ts#L304) - `ExtractionSettings`\
Settings that control which fields and images should be extracted from the payment card.\
Disabling extraction of unused fields can improve recognition performance or reduce memory usage.

6. [Anonymization settings](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/blinkCardSettings.ts#L374) - `AnonymizationSettings`\
Holds the settings which control the anonymization of returned data.

7. [Cropped image settings](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/blinkCardSettings.ts#L433) - `CroppedImageSettings`\
These settings represent the image cropping settings.\
This class controls how card images are cropped, including the resolution, extension of the cropping area, and whether the cropped image should be returned in the results.

8. [Scanning UX settings](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/blinkCardSettings.ts#L475) - `ScanningUxSettings`\
These settings allow customization of various aspects of the UI/UX.
Displaying certain UI elements, haptic feedback, along with choosing the preffered camera position used when capturing document can modified.

**Additional notes:**

- The [blinkCardSettings.ts](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/blinkCardSettings.ts) file contains all the settings that can be modified and explains what each setting does in more detail.

- The native documentation for the above mentioned settings can be found here for [Android](https://blinkcard.github.io/blinkcard-android/blinkcard-core/index.html) & [iOS](https://blinkcard.github.io/blinkcard-swift-package/documentation/blinkcard/).

- The native Kotlin & Swift implementation of all BlinkCard settings can be found here for [Android](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/android/src/main/java/com/microblink/blinkcard/reactnative/serialization/BlinkCardDeserializationUtils.kt) & [iOS](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/ios/Serialization/BlinkCardDeserializationUtils.swift) in the BlinkCard deserialization utilities.

### <a name="BlinkCard-result"></a> BlinkCard Results

The result of the scanning process is stored in the `BlinkCardScanningResult`. It contains the results of scanning a card, including the extracted data, liveness information, and the card images:

1. **Issuing network**- `string`\
Payment card's issuing network.

2. **Card account result** - `CardAccountResult[]`\
Payment card accounts found on the card.\
A list of payment card accounts found on the card. Each result in the list represents a distinct payment account containing details like the card number, CVV, and expiry date.

3. **IBAN** - `string?`\
The IBAN (International Bank Account Number) of the card, or null if not available.

4. **Cardholder name** - `string?`\
Information about the cardholder name, or null if not available.

5. **Overall card liveness result** - `CheckResult`\
The overall liveness check result for the card.\
This result aggregates the outcomes of various liveness checks performed on the card to determine its authenticity
- Set to `Pass` if all individual checks have passed.
- Set to `Fail` if any individual check has failed.

**Additional notes:**

- The [blinkCardResult.ts](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/src/blinkCardResult.ts) file contains all the results that can be obtained and explains what each result represents in more detail.

- The native documentation for the above mentioned results can be found here for [Android](https://blinkcard.github.io/blinkcard-android/blinkcard-core/com.microblink.blinkcard.core.session/-blink-card-scanning-result/index.html) & [iOS](https://blinkcard.github.io/blinkcard-swift-package/documentation/blinkcard/blinkcardscanningresult).

- The native Kotlin & Swift implementation of all BlinkCard results can be found here for [Android](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/android/src/main/java/com/microblink/blinkcard/reactnative/serialization/BlinkCardSerializationUtils.kt) & [iOS](https://github.com/microblink/blinkcard-react-native/blob/main/BlinkCard/ios/Serialization/BlinkCardSerializationUtils.swift) in the BlinkCard serialization utilities.

## <a name="npm"></a> NPM
- The BlinkCard React Native module can also be found on NPM [here](https://www.npmjs.com/package/@microblink/blinkcard-react-native).

## <a name="additional-information"></a> Additional information
For any additional questions and information, feel free to contact us [here](https://help.microblink.com), or directly to the Support team via mail support@microblink.com.