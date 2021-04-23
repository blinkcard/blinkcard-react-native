package com.microblink.blinkcard.reactnative.recognizers.serialization;

import com.microblink.blinkcard.reactnative.SerializationUtils;

import com.microblink.blinkcard.entities.recognizers.blinkcard.BlinkCardAnonymizationMode;
import com.microblink.blinkcard.entities.recognizers.blinkcard.BlinkCardAnonymizationSettings;
import com.microblink.blinkcard.entities.recognizers.blinkcard.CardNumberAnonymizationSettings;

import com.facebook.react.bridge.ReadableMap;

public abstract class BlinkCardSerializationUtils {
     public static CardNumberAnonymizationSettings deserializeCardNumberAnonymizationSettings(ReadableMap json) {
        if (json == null) {
            return new CardNumberAnonymizationSettings();
        } else {
            BlinkCardAnonymizationMode mode = BlinkCardAnonymizationMode.values()[json.getInt("mode") -1];
            int prefix = json.getInt("prefixDigitsVisible");
            int suffix = json.getInt("suffixDigitsVisible");
            return new CardNumberAnonymizationSettings(mode, prefix, suffix);
        }
    }

    public static BlinkCardAnonymizationSettings deserializeBlinkCardAnonymizationSettings(ReadableMap json) {
        BlinkCardAnonymizationSettings settings = new BlinkCardAnonymizationSettings();
        if (json != null) {
            settings.setCardNumberAnonymizationSettings(BlinkCardSerializationUtils.deserializeCardNumberAnonymizationSettings(json.getMap("cardNumberAnonymizationSettings")));
            settings.setCvvAnonymizationMode(BlinkCardAnonymizationMode.values()[json.getInt("cvvAnonymizationMode") -1]);
            settings.setIbanAnonymizationMode(BlinkCardAnonymizationMode.values()[json.getInt("ibanAnonymizationMode") -1]);
            settings.setCardNumberPrefixAnonymizationMode(BlinkCardAnonymizationMode.values()[json.getInt("cardNumberPrefixAnonymizationMode") -1]);
            settings.setOwnerAnonymizationMode(BlinkCardAnonymizationMode.values()[json.getInt("ownerAnonymizationMode") -1]);
        }

        return settings;
    }

}