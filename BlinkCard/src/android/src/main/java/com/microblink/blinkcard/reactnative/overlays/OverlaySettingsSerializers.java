package com.microblink.blinkcard.reactnative.overlays;

import android.content.Context;

import com.facebook.react.bridge.ReadableMap;
import com.microblink.blinkcard.entities.recognizers.RecognizerBundle;
import com.microblink.blinkcard.reactnative.overlays.serialization.*;
import com.microblink.blinkcard.uisettings.UISettings;

import java.util.HashMap;

public enum OverlaySettingsSerializers {
    INSTANCE;

    private HashMap<String, OverlaySettingsSerialization> mByJSONName = new HashMap<>();

    private void registerMapping(OverlaySettingsSerialization overlaySettingsSerialization) {
        mByJSONName.put(overlaySettingsSerialization.getJsonName(), overlaySettingsSerialization);
    }

    OverlaySettingsSerializers() {
        registerMapping(new BlinkCardOverlaySettingsSerialization());
    }

    public UISettings getOverlaySettings(Context context, ReadableMap jsonOverlaySettings, RecognizerBundle recognizerBundle) {
        return mByJSONName.get(jsonOverlaySettings.getString("overlaySettingsType")).createUISettings(context, jsonOverlaySettings, recognizerBundle);
    }
}