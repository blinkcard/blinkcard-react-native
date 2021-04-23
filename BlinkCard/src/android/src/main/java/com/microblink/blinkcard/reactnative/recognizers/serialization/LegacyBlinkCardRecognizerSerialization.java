package com.microblink.blinkcard.reactnative.recognizers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.blinkcard.entities.recognizers.Recognizer;
import com.microblink.blinkcard.reactnative.recognizers.RecognizerSerialization;
import com.microblink.blinkcard.reactnative.SerializationUtils;

public final class LegacyBlinkCardRecognizerSerialization implements RecognizerSerialization {
    @Override
    public Recognizer<?> createRecognizer(ReadableMap jsonMap) {
        com.microblink.blinkcard.entities.recognizers.blinkcard.legacy.LegacyBlinkCardRecognizer recognizer = new com.microblink.blinkcard.entities.recognizers.blinkcard.legacy.LegacyBlinkCardRecognizer();
        if (jsonMap.hasKey("anonymizeCardNumber")) {
            recognizer.setAnonymizeCardNumber(jsonMap.getBoolean("anonymizeCardNumber"));
        }
        if (jsonMap.hasKey("anonymizeCvv")) {
            recognizer.setAnonymizeCvv(jsonMap.getBoolean("anonymizeCvv"));
        }
        if (jsonMap.hasKey("anonymizeIban")) {
            recognizer.setAnonymizeIban(jsonMap.getBoolean("anonymizeIban"));
        }
        if (jsonMap.hasKey("anonymizeOwner")) {
            recognizer.setAnonymizeOwner(jsonMap.getBoolean("anonymizeOwner"));
        }
        if (jsonMap.hasKey("detectGlare")) {
            recognizer.setDetectGlare(jsonMap.getBoolean("detectGlare"));
        }
        if (jsonMap.hasKey("extractCvv")) {
            recognizer.setExtractCvv(jsonMap.getBoolean("extractCvv"));
        }
        if (jsonMap.hasKey("extractIban")) {
            recognizer.setExtractIban(jsonMap.getBoolean("extractIban"));
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
        if (jsonMap.hasKey("signResult")) {
            recognizer.setSignResult(jsonMap.getBoolean("signResult"));
        }
        return recognizer;
    }

    @Override
    public WritableMap serializeResult(Recognizer<?> recognizer) {
        com.microblink.blinkcard.entities.recognizers.blinkcard.legacy.LegacyBlinkCardRecognizer.Result result = ((com.microblink.blinkcard.entities.recognizers.blinkcard.legacy.LegacyBlinkCardRecognizer)recognizer).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonRecognizerResultData(jsonResult, result);
        jsonResult.putString("cardNumber", result.getCardNumber());
        jsonResult.putString("cvv", result.getCvv());
        jsonResult.putString("digitalSignature", SerializationUtils.encodeByteArrayToBase64(result.getDigitalSignature()));
        jsonResult.putInt("digitalSignatureVersion", (int)result.getDigitalSignatureVersion());
        jsonResult.putInt("documentDataMatch", SerializationUtils.serializeEnum(result.getDocumentDataMatch()));
        jsonResult.putString("fullDocumentBackImage", SerializationUtils.encodeImageBase64(result.getFullDocumentBackImage()));
        jsonResult.putString("fullDocumentFrontImage", SerializationUtils.encodeImageBase64(result.getFullDocumentFrontImage()));
        jsonResult.putString("iban", result.getIban());
        jsonResult.putString("inventoryNumber", result.getInventoryNumber());
        jsonResult.putInt("issuer", SerializationUtils.serializeEnum(result.getIssuer()));
        jsonResult.putString("owner", result.getOwner());
        jsonResult.putBoolean("scanningFirstSideDone", result.isScanningFirstSideDone());
        jsonResult.putMap("validThru", SerializationUtils.serializeDate(result.getValidThru()));
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "LegacyBlinkCardRecognizer";
    }

    @Override
    public Class<?> getRecognizerClass() {
        return com.microblink.blinkcard.entities.recognizers.blinkcard.legacy.LegacyBlinkCardRecognizer.class;
    }
}