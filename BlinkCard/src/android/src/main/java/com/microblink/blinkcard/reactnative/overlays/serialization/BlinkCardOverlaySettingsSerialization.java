package com.microblink.blinkcard.reactnative.overlays.serialization;

import android.content.Context;

import com.facebook.react.bridge.ReadableMap;
import com.microblink.blinkcard.entities.recognizers.RecognizerBundle;
import com.microblink.blinkcard.fragment.overlay.blinkcard.scanlineui.ScanLineOverlayStrings;
import com.microblink.blinkcard.reactnative.overlays.OverlaySettingsSerialization;
import com.microblink.blinkcard.uisettings.BlinkCardUISettings;
import com.microblink.blinkcard.uisettings.UISettings;

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

        ScanLineOverlayStrings.Builder stringsBuilder = new ScanLineOverlayStrings.Builder(context);
        String firstSideInstructions = getStringFromMap(jsonUISettings, "firstSideInstructions");
        if (firstSideInstructions != null) {
            stringsBuilder.setFrontSideInstructions(firstSideInstructions);
        }
        String flipCardInstructions = getStringFromMap(jsonUISettings, "flipCardInstructions");
        if (flipCardInstructions != null) {
            stringsBuilder.setFlipCardInstructions(flipCardInstructions);
        }
        settings.setStrings(stringsBuilder.build());
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