package com.microblink.blinkcard.reactnative.overlays;

import android.content.Context;

import com.facebook.react.bridge.ReadableMap;
import com.microblink.blinkcard.entities.recognizers.RecognizerBundle;
import com.microblink.blinkcard.uisettings.UISettings;

public interface OverlaySettingsSerialization {
    UISettings createUISettings(Context context, ReadableMap jsonUISettings, RecognizerBundle recognizerBundle);

    String getJsonName();
}