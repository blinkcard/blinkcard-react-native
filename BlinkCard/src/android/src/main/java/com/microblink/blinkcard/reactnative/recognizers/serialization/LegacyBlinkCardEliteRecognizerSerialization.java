package com.microblink.blinkcard.reactnative.recognizers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.blinkcard.entities.recognizers.Recognizer;
import com.microblink.blinkcard.reactnative.recognizers.RecognizerSerialization;
import com.microblink.blinkcard.reactnative.SerializationUtils;

public final class LegacyBlinkCardEliteRecognizerSerialization implements RecognizerSerialization {
    @Override
    public Recognizer<?> createRecognizer(ReadableMap jsonMap) {
        com.microblink.blinkcard.entities.recognizers.blinkcard.legacy.LegacyBlinkCardEliteRecognizer recognizer = new com.microblink.blinkcard.entities.recognizers.blinkcard.legacy.LegacyBlinkCardEliteRecognizer();
        if (jsonMap.hasKey("anonymizeCardNumber")) {
            recognizer.setAnonymizeCardNumber(jsonMap.getBoolean("anonymizeCardNumber"));
        }
        if (jsonMap.hasKey("anonymizeCvv")) {
            recognizer.setAnonymizeCvv(jsonMap.getBoolean("anonymizeCvv"));
        }
        if (jsonMap.hasKey("anonymizeOwner")) {
            recognizer.setAnonymizeOwner(jsonMap.getBoolean("anonymizeOwner"));
        }
        if (jsonMap.hasKey("detectGlare")) {
            recognizer.setDetectGlare(jsonMap.getBoolean("detectGlare"));
        }
        if (jsonMap.hasKey("extractInventoryNumber")) {
            recognizer.setExtractInventoryNumber(jsonMap.getBoolean("extractInventoryNumber"));
        }
        if (jsonMap.hasKey("extractOwner")) {
            recognizer.setExtractOwner(jsonMap.getBoolean("extractOwner"));
        }
        if (jsonMap.hasKey("extractValidThru")) {
            recognizer.setExtractValidThru(jsonMap.getBoolean("extractValidThru"));
        }
        if (jsonMap.hasKey("fullDocumentImageDpi")) {
            recognizer.setFullDocumentImageDpi(jsonMap.getInt("fullDocumentImageDpi"));
        }
        if (jsonMap.hasKey("fullDocumentImageExtensionFactors")) {
            recognizer.setFullDocumentImageExtensionFactors(SerializationUtils.deserializeExtensionFactors(jsonMap.getMap("fullDocumentImageExtensionFactors")));
        }
        if (jsonMap.hasKey("returnFullDocumentImage")) {
            recognizer.setReturnFullDocumentImage(jsonMap.getBoolean("returnFullDocumentImage"));
        }
        return recognizer;
    }

    @Override
    public WritableMap serializeResult(Recognizer<?> recognizer) {
        com.microblink.blinkcard.entities.recognizers.blinkcard.legacy.LegacyBlinkCardEliteRecognizer.Result result = ((com.microblink.blinkcard.entities.recognizers.blinkcard.legacy.LegacyBlinkCardEliteRecognizer)recognizer).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonRecognizerResultData(jsonResult, result);
        jsonResult.putString("cardNumber", result.getCardNumber());
        jsonResult.putString("cvv", result.getCvv());
        jsonResult.putInt("documentDataMatch", SerializationUtils.serializeEnum(result.getDocumentDataMatch()));
        jsonResult.putString("fullDocumentBackImage", SerializationUtils.encodeImageBase64(result.getFullDocumentBackImage()));
        jsonResult.putString("fullDocumentFrontImage", SerializationUtils.encodeImageBase64(result.getFullDocumentFrontImage()));
        jsonResult.putString("inventoryNumber", result.getInventoryNumber());
        jsonResult.putString("owner", result.getOwner());
        jsonResult.putBoolean("scanningFirstSideDone", result.isScanningFirstSideDone());
        jsonResult.putMap("validThru", SerializationUtils.serializeDate(result.getValidThru()));
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "LegacyBlinkCardEliteRecognizer";
    }

    @Override
    public Class<?> getRecognizerClass() {
        return com.microblink.blinkcard.entities.recognizers.blinkcard.legacy.LegacyBlinkCardEliteRecognizer.class;
    }
}