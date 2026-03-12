import React, { useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  SafeAreaView,
} from "react-native";

import { BlinkCardResultBuilder } from "./BlinkCardResultBuilder";
import { launchImageLibrary } from "react-native-image-picker";
import {
  AnonymizationMode,
  AnonymizationSettings,
  BlinkCardScanningResult,
  BlinkCardSdkSettings,
  BlinkCardSessionSettings,
  CameraPosition,
  CardNumberAnonymizationSettings,
  CroppedImageSettings,
  DetectionLevel,
  ExtractionSettings,
  LivenessSettings,
  performScan,
  perfromDirectApiScan,
  ScanningSettings,
  ScanningUxSettings,
  StrictnessLevel,
} from "@microblink/blinkcard-react-native";

export default function App() {
  const [result, setResult] = useState<string | undefined>(
    'Press the "Perform scan" button to scan documents with the Default BlinkCard UX experience.\n\nPress the "Direct API MultiSide Scan" button to extract document information from multiple static images.\n\nPress the "Direct API SingleSide Scan" button to extract document information from a single static image.',
  );

  const [firstSideImage, setFirstSideImage] = useState<string | undefined>();
  const [secondSideImage, setSecondSideImage] = useState<string | undefined>();

  const blinkCardLicenseKey = Platform.select({
    ios: "sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUBbGV5SkRjbVZoZEdWa1QyNGlPakUzTnpJM01USXlNemt3T0Rrc0lrTnlaV0YwWldSR2IzSWlPaUprWkdRd05qWmxaaTAxT0RJekxUUXdNRGd0T1RRNE1DMDFORFU0WWpBeFlUVTJZamdpZlE9PXDZkGGlrcyQx8Ic8eGrb7YuRfJYO1Ez+bOLcQtLyQ3HNMc+htny28u5Etjj3BTk2Q39au9g1hJpJQm0J/utSGiRhQT/rVQFdFKU+vS4eUVr2im0FnMtdCS3EVofbA==",
    android:
      "sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUAbGV5SkRjbVZoZEdWa1QyNGlPakUzTnpJM01USXlOamt4T1RNc0lrTnlaV0YwWldSR2IzSWlPaUprWkdRd05qWmxaaTAxT0RJekxUUXdNRGd0T1RRNE1DMDFORFU0WWpBeFlUVTJZamdpZlE9PdXzP6loVm3KEys/pvWnco8AYZHWjNoSnU0owabUT/XVMbU2VhlvbyDzXfCeW+NkZJA3upTcu73cs/WbPzbsVoD6wjbHbYwP0+3f51CLps32C13bg/h9DS+73OYmTw==",
  });

  /**
   * NOTE: if needed, the SDK can be pre-loaded before the scanning session starts.
   * This will ensure that the SDK is initialized, that the resources have been obtained, and the license verified.
   * This results in reducing the loading time of the scanning sessions.
   * To do this, call the loadBlinkCardMethod:
   * loadSdk(new BlinkCardSdkSettings(licenseKey));
   *
   * To unload the SDK, or to be more precise, terminate the BlinkCard SDK and releases all associated resources, call:
   * await unloadSdk(true);
   */

  const handlePerformScan = async () => {
    try {
      setResult(undefined);
      resetImages();
      /**
       * Set the BlinkCard SDK settings
       * Add the license key here from the code above
       */
      /// Set the BlinkCard SDK settings
      const sdkSettings = new BlinkCardSdkSettings({
        licenseKey: blinkCardLicenseKey ?? "",
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

      /**
       * Call the 'performScan' method and handle the results
       *
       * Check how the results are handled in the BlinkCardResultBuilder.ts file
       */
      const blinkCardResult = await performScan(
        sdkSettings,
        sessionSettings,
        scanningUxSettings,
      );

      setResult(BlinkCardResultBuilder.getCardResultString(blinkCardResult));
      setImages(blinkCardResult);
    } catch (error) {
      setResult(`BlinkCard scanning error: ${error}`);
      resetImages();
    }
  };

  const handlePerformDirectApiMultiSideScan = async () => {
    try {
      setResult(undefined);
      resetImages();
      /**
       * Pick the first image of the document
       * Make sure it is the front side
       */
      const firstImage = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
      });

      if (firstImage.assets == null || !firstImage.assets[0]?.base64) {
        setResult("First image not selected or invalid.");
        return;
      }

      /**
       * Take the Base64 of the selected image
       */
      const firstImageBase64 = firstImage.assets[0].base64;

      /**
       * Pick the second image of the document
       * Make sure it is the back side of the document
       */
      const secondImage = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
      });

      if (secondImage.assets == null || !secondImage.assets[0]?.base64) {
        setResult("Second image not selected or invalid.");
        return;
      }

      /**
       * Take the Base64 of the selected image
       */
      const secondImageBase64 = secondImage.assets[0].base64;

      /**
       * Set the BlinkCard SDK settings
       * Add the license key here from the code above
       */
      /// Set the BlinkCard SDK settings
      const sdkSettings = new BlinkCardSdkSettings({
        licenseKey: blinkCardLicenseKey ?? "",
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
       * Call the performDirectApiScan method, where the SDK and session settings need to
       * be passed, along with the Base64 images.
       */
      const blinkCardResult = await perfromDirectApiScan(
        sdkSettings,
        sessionSettings,
        firstImageBase64,
        secondImageBase64,
      );

      setResult(BlinkCardResultBuilder.getCardResultString(blinkCardResult));
      setImages(blinkCardResult);
    } catch (error) {
      setResult(`BlinkCard DirectAPI error: ${error}`);
      resetImages();
    }
  };

  const handlePerformDirectApiSingleSideScan = async () => {
    try {
      setResult(undefined);
      resetImages();
      /**
       * Pick an image of the document
       * It can either be the front of the back side of the document
       */
      const image = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
      });

      if (image.assets == null || !image.assets[0]?.base64) {
        setResult("The selected image is not selected or is invalid.");
        return;
      }

      /**
       * Take the Base64 of the selected image
       */
      const imageBase64 = image.assets[0].base64;

      /**
       * Set the BlinkCard SDK settings
       * Add the license key here from the code above
       */
      /// Set the BlinkCard SDK settings
      const sdkSettings = new BlinkCardSdkSettings({
        licenseKey: blinkCardLicenseKey ?? "",
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
       *
       * Since all of the information is set to `false`
       * Only one image is required
       */
      const extractionSettings = new ExtractionSettings();
      extractionSettings.extractCardholderName = false;
      extractionSettings.extractCvv = false;
      extractionSettings.extractExpiryDate = false;
      extractionSettings.extractIban = false;
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
       * Call the performDirectApiScan method, where the SDK and session settings need to
       * be passed, along with the Base64 images.
       */
      const blinkCardResult = await perfromDirectApiScan(
        sdkSettings,
        sessionSettings,
        imageBase64,
      );

      setResult(BlinkCardResultBuilder.getCardResultString(blinkCardResult));
      setImages(blinkCardResult);
    } catch (error) {
      setResult(`SDK error: ${error}`);
      resetImages();
    }
  };

  function setImages(result: BlinkCardScanningResult | undefined) {
    setFirstSideImage(result?.firstSideResult?.cardImage?.image);
    setSecondSideImage(result?.secondSideResult?.cardImage?.image);
  }

  function resetImages() {
    setFirstSideImage(undefined);
    setSecondSideImage(undefined);
  }

  return (
    <View style={styles.container}>
      <View>
        <SafeAreaView></SafeAreaView>
        <View style={styles.spacer} />
        <Button title="Perform Scan" onPress={handlePerformScan} />
        <View style={styles.spacer} />
        <Button
          title="Direct API MultiSide Scan"
          onPress={handlePerformDirectApiMultiSideScan}
        />
        <View style={styles.spacer} />
        <Button
          title="Direct API SingleSide Scan"
          onPress={handlePerformDirectApiSingleSideScan}
        />
      </View>
      <ScrollView style={styles.resultBox}>
        <Text>{result}</Text>
      </ScrollView>

      <ScrollView style={styles.imageScroll} horizontal>
        {firstSideImage && (
          <DocumentImageContainer
            label="First side image"
            imageUri={`data:image/jpeg;base64,${firstSideImage}`}
          />
        )}
        {secondSideImage && (
          <DocumentImageContainer
            label="Back Document Image"
            imageUri={`data:image/jpeg;base64,${secondSideImage}`}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  spacer: {
    height: 25,
  },

  resultBox: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    maxHeight: "auto",
  },

  imageScroll: {
    marginTop: 20,
    maxHeight: 300,
  },
  imageContainer: {
    margin: 10,
    marginTop: 20,
    alignItems: "center",
  },
  imageLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
});

type DocumentImageContainerProps = {
  label: string;
  imageUri: string;
};

const DocumentImageContainer: React.FC<DocumentImageContainerProps> = ({
  label,
  imageUri,
}) => {
  return (
    <View style={styles.imageContainer}>
      <Text style={styles.imageLabel}>{label}</Text>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};
