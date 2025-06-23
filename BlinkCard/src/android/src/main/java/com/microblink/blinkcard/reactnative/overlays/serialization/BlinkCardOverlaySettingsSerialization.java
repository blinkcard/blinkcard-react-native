package com.microblink.blinkcard.reactnative.overlays.serialization;

import android.content.Context;

import com.facebook.react.bridge.ReadableMap;
import com.microblink.blinkcard.entities.recognizers.RecognizerBundle;
import com.microblink.blinkcard.fragment.overlay.blinkcard.reticleui.BlinkCardReticleOverlayStrings;
import com.microblink.blinkcard.reactnative.overlays.OverlaySettingsSerialization;
import com.microblink.blinkcard.uisettings.BlinkCardUISettings;
import com.microblink.blinkcard.uisettings.UISettings;
import com.microblink.blinkcard.hardware.camera.VideoResolutionPreset;
import com.microblink.blinkcard.uisettings.CameraSettings;

public final class BlinkCardOverlaySettingsSerialization implements OverlaySettingsSerialization {
    @Override
    public UISettings createUISettings(Context context, ReadableMap jsonUISettings, RecognizerBundle recognizerBundle) {
        BlinkCardUISettings settings = new BlinkCardUISettings(recognizerBundle);
        OverlaySerializationUtils.extractCommonUISettings(jsonUISettings, settings);

        settings.setEditScreenEnabled(false);

        Boolean showFlashlightWarning = getBooleanFromMap(jsonUISettings, "showFlashlightWarning");
        if (showFlashlightWarning != null) {
            settings.setShowGlareWarning(showFlashlightWarning);
        }

        Boolean showOnboardingInfo = getBooleanFromMap(jsonUISettings, "showOnboardingInfo");
        if (showOnboardingInfo != null) {
            settings.setShowOnboardingInfo(showOnboardingInfo);
        }

        Boolean showIntroductionDialog = getBooleanFromMap(jsonUISettings, "showIntroductionDialog");
        if (showIntroductionDialog != null) {
            settings.setShowIntroductionDialog(showIntroductionDialog);
        }

        if (jsonUISettings.hasKey("onboardingButtonTooltipDelay")) {
            settings.setShowTooltipTimeIntervalMs(jsonUISettings.getInt("onboardingButtonTooltipDelay"));
        }

        BlinkCardReticleOverlayStrings.Builder overlayStringsBuilder = new BlinkCardReticleOverlayStrings.Builder(context);
        String firstSideInstructions = getStringFromMap(jsonUISettings, "firstSideInstructions");
        if (firstSideInstructions != null) {
            overlayStringsBuilder.setFrontSideInstructionsText(firstSideInstructions);
        }
        String flipCardInstructions = getStringFromMap(jsonUISettings, "flipCardInstructions");
        if (flipCardInstructions != null) {
            overlayStringsBuilder.setFlipCardInstructions(flipCardInstructions);
        }
        String errorMoveCloser = getStringFromMap(jsonUISettings, "errorMoveCloser");
        if (errorMoveCloser != null) {
            overlayStringsBuilder.setErrorMoveCloser(errorMoveCloser);
        }
        String errorMoveFarther = getStringFromMap(jsonUISettings, "errorMoveFarther");
        if (errorMoveFarther != null) {
            overlayStringsBuilder.setErrorMoveFarther(errorMoveFarther);
        }
        String errorCardTooCloseToEdge = getStringFromMap(jsonUISettings, "errorCardTooCloseToEdge");
        if (errorCardTooCloseToEdge != null) {
            overlayStringsBuilder.setErrorCardTooCloseToEdge(errorCardTooCloseToEdge);
        }
        String scanningWrongSideMessage = getStringFromMap(jsonUISettings, "scanningWrongSideMessage");
        if (scanningWrongSideMessage != null) {
            overlayStringsBuilder.setErrorScanningWrongSide(scanningWrongSideMessage);
        }
        
        VideoResolutionPreset videoResolutionPreset = VideoResolutionPreset.values()[0];
        if (jsonUISettings.hasKey("androidCameraResolutionPreset")) {
            videoResolutionPreset = VideoResolutionPreset.values()[jsonUISettings.getInt("androidCameraResolutionPreset")];
        }

        Boolean androidLegacyCameraApi = false;
        if (jsonUISettings.hasKey("enableAndroidLegacyCameraApi")) {
            androidLegacyCameraApi = jsonUISettings.getBoolean("enableAndroidLegacyCameraApi");
        }

        settings.setCameraSettings(new CameraSettings.Builder()
                .setVideoResolutionPreset(videoResolutionPreset)
                .setForceLegacyApi(androidLegacyCameraApi)
                .build());
        
        settings.setStrings(overlayStringsBuilder.build());
        return settings;
    }

    private String getStringFromMap(ReadableMap map, String key) {
        if (map.hasKey(key)) {
            return map.getString(key);
        }
        return null;
    }

    public static Boolean getBooleanFromMap(ReadableMap map, String key) {
        if (map.hasKey(key)) {
            return map.getBoolean(key);
        }
        return null;
    }

    @Override
    public String getJsonName() {
        return "BlinkCardOverlaySettings";
    }
}