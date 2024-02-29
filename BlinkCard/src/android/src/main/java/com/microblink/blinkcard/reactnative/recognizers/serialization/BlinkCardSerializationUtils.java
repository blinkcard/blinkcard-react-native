package com.microblink.blinkcard.reactnative.recognizers.serialization;

import com.microblink.blinkcard.reactnative.SerializationUtils;

import com.microblink.blinkcard.entities.recognizers.blinkcard.BlinkCardAnonymizationMode;
import com.microblink.blinkcard.entities.recognizers.blinkcard.BlinkCardAnonymizationSettings;
import com.microblink.blinkcard.entities.recognizers.blinkcard.CardNumberAnonymizationSettings;
import com.microblink.blinkcard.entities.recognizers.blinkcard.MatchLevel;
import com.microblink.blinkcard.entities.recognizers.blinkcard.DocumentLivenessCheckResult;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

public abstract class BlinkCardSerializationUtils {
     public static CardNumberAnonymizationSettings deserializeCardNumberAnonymizationSettings(ReadableMap json) {
        if (json == null) {
            return new CardNumberAnonymizationSettings();
        } else {
            BlinkCardAnonymizationMode mode = BlinkCardAnonymizationMode.values()[json.getInt("mode")];
            int prefix = json.getInt("prefixDigitsVisible");
            int suffix = json.getInt("suffixDigitsVisible");
            return new CardNumberAnonymizationSettings(mode, prefix, suffix);
        }
    }

    public static BlinkCardAnonymizationSettings deserializeBlinkCardAnonymizationSettings(ReadableMap json) {
        BlinkCardAnonymizationSettings settings = new BlinkCardAnonymizationSettings();
        if (json != null) {
            settings.setCardNumberAnonymizationSettings(BlinkCardSerializationUtils.deserializeCardNumberAnonymizationSettings(json.getMap("cardNumberAnonymizationSettings")));
            settings.setCvvAnonymizationMode(BlinkCardAnonymizationMode.values()[json.getInt("cvvAnonymizationMode")]);
            settings.setIbanAnonymizationMode(BlinkCardAnonymizationMode.values()[json.getInt("ibanAnonymizationMode")]);
            settings.setCardNumberPrefixAnonymizationMode(BlinkCardAnonymizationMode.values()[json.getInt("cardNumberPrefixAnonymizationMode")]);
            settings.setOwnerAnonymizationMode(BlinkCardAnonymizationMode.values()[json.getInt("ownerAnonymizationMode")]);
        }

        return settings;
    }

    public static WritableMap serializeDocumentLivenessCheckResult(DocumentLivenessCheckResult documentLivenessCheckResult) {
        WritableMap jsonDocumentLivenessCheckResult = new WritableNativeMap();

            if (documentLivenessCheckResult != null) {
                WritableMap frontDocumentLivenessResult = new WritableNativeMap();
                frontDocumentLivenessResult.putInt("handPresenceCheck", documentLivenessCheckResult.getFront().getHandPresenceCheck().ordinal());
                frontDocumentLivenessResult.putInt("photocopyCheck", documentLivenessCheckResult.getFront().getPhotocopyCheck().getCheckResult().ordinal());
                frontDocumentLivenessResult.putInt("screenCheck", documentLivenessCheckResult.getFront().getScreenCheck().getCheckResult().ordinal());
                jsonDocumentLivenessCheckResult.putMap("front", frontDocumentLivenessResult);

                WritableMap backDocumentLivenessResult = new WritableNativeMap();
                backDocumentLivenessResult.putInt("handPresenceCheck", documentLivenessCheckResult.getBack().getHandPresenceCheck().ordinal());
                backDocumentLivenessResult.putInt("photocopyCheck", documentLivenessCheckResult.getBack().getPhotocopyCheck().getCheckResult().ordinal());
                backDocumentLivenessResult.putInt("screenCheck", documentLivenessCheckResult.getBack().getScreenCheck().getCheckResult().ordinal());
                jsonDocumentLivenessCheckResult.putMap("back", backDocumentLivenessResult);
            }
            return jsonDocumentLivenessCheckResult;
        }

    public static MatchLevel deserializeMatchLevel(int value) {
            return MatchLevel.values()[value];
     }

}