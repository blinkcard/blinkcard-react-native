package com.microblink.blinkcard.reactnative.recognizers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.blinkcard.entities.recognizers.Recognizer;
import com.microblink.blinkcard.reactnative.recognizers.RecognizerSerialization;
import com.microblink.blinkcard.reactnative.SerializationUtils;

public final class BlinkCardRecognizerSerialization implements RecognizerSerialization {
    @Override
    public Recognizer<?> createRecognizer(ReadableMap jsonMap) {
        com.microblink.blinkcard.entities.recognizers.blinkcard.BlinkCardRecognizer recognizer = new com.microblink.blinkcard.entities.recognizers.blinkcard.BlinkCardRecognizer();
        if (jsonMap.hasKey("allowBlurFilter")) {
            recognizer.setAllowBlurFilter(jsonMap.getBoolean("allowBlurFilter"));
        }
        if (jsonMap.hasKey("allowInvalidCardNumber")) {
            recognizer.setAllowInvalidCardNumber(jsonMap.getBoolean("allowInvalidCardNumber"));
        }
        if (jsonMap.hasKey("anonymizationSettings")) {
            recognizer.setAnonymizationSettings(BlinkCardSerializationUtils.deserializeBlinkCardAnonymizationSettings(jsonMap.getMap("anonymizationSettings")));
        }
        if (jsonMap.hasKey("extractCvv")) {
            recognizer.setExtractCvv(jsonMap.getBoolean("extractCvv"));
        }
        if (jsonMap.hasKey("extractExpiryDate")) {
            recognizer.setExtractExpiryDate(jsonMap.getBoolean("extractExpiryDate"));
        }
        if (jsonMap.hasKey("extractIban")) {
            recognizer.setExtractIban(jsonMap.getBoolean("extractIban"));
        }
        if (jsonMap.hasKey("extractOwner")) {
            recognizer.setExtractOwner(jsonMap.getBoolean("extractOwner"));
        }
        if (jsonMap.hasKey("fullDocumentImageDpi")) {
            recognizer.setFullDocumentImageDpi(jsonMap.getInt("fullDocumentImageDpi"));
        }
        if (jsonMap.hasKey("fullDocumentImageExtensionFactors")) {
            recognizer.setFullDocumentImageExtensionFactors(SerializationUtils.deserializeExtensionFactors(jsonMap.getMap("fullDocumentImageExtensionFactors")));
        }
        if (jsonMap.hasKey("handDocumentOverlapThreshold")) {
            recognizer.setHandDocumentOverlapThreshold((float)jsonMap.getDouble("handDocumentOverlapThreshold"));
        }
        if (jsonMap.hasKey("handScaleThreshold")) {
            recognizer.setHandScaleThreshold((float)jsonMap.getDouble("handScaleThreshold"));
        }
        if (jsonMap.hasKey("paddingEdge")) {
            recognizer.setPaddingEdge((float)jsonMap.getDouble("paddingEdge"));
        }
        if (jsonMap.hasKey("photocopyAnalysisMatchLevel")) {
            recognizer.setPhotocopyAnalysisMatchLevel(BlinkCardSerializationUtils.deserializeMatchLevel(jsonMap.getInt("photocopyAnalysisMatchLevel")));
        }
        if (jsonMap.hasKey("returnFullDocumentImage")) {
            recognizer.setReturnFullDocumentImage(jsonMap.getBoolean("returnFullDocumentImage"));
        }
        if (jsonMap.hasKey("screenAnalysisMatchLevel")) {
            recognizer.setScreenAnalysisMatchLevel(BlinkCardSerializationUtils.deserializeMatchLevel(jsonMap.getInt("screenAnalysisMatchLevel")));
        }
        return recognizer;
    }

    @Override
    public WritableMap serializeResult(Recognizer<?> recognizer) {
        com.microblink.blinkcard.entities.recognizers.blinkcard.BlinkCardRecognizer.Result result = ((com.microblink.blinkcard.entities.recognizers.blinkcard.BlinkCardRecognizer)recognizer).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonRecognizerResultData(jsonResult, result);
        jsonResult.putString("cardNumber", result.getCardNumber());
        jsonResult.putString("cardNumberPrefix", result.getCardNumberPrefix());
        jsonResult.putBoolean("cardNumberValid", result.isCardNumberValid());
        jsonResult.putString("cvv", result.getCvv());
        jsonResult.putMap("documentLivenessCheck", BlinkCardSerializationUtils.serializeDocumentLivenessCheckResult(result.getDocumentLivenessCheck()));
        jsonResult.putMap("expiryDate", SerializationUtils.serializeDate(result.getExpiryDate()));
        jsonResult.putBoolean("firstSideAnonymized", result.isFirstSideAnonymized());
        jsonResult.putBoolean("firstSideBlurred", result.isFirstSideBlurred());
        jsonResult.putString("firstSideFullDocumentImage", SerializationUtils.encodeImageBase64(result.getFirstSideFullDocumentImage()));
        jsonResult.putString("iban", result.getIban());
        jsonResult.putInt("issuer", SerializationUtils.serializeEnum(result.getIssuer()));
        jsonResult.putString("owner", result.getOwner());
        jsonResult.putInt("processingStatus", SerializationUtils.serializeEnum(result.getProcessingStatus()));
        jsonResult.putBoolean("scanningFirstSideDone", result.isScanningFirstSideDone());
        jsonResult.putBoolean("secondSideAnonymized", result.isSecondSideAnonymized());
        jsonResult.putBoolean("secondSideBlurred", result.isSecondSideBlurred());
        jsonResult.putString("secondSideFullDocumentImage", SerializationUtils.encodeImageBase64(result.getSecondSideFullDocumentImage()));
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "BlinkCardRecognizer";
    }

    @Override
    public Class<?> getRecognizerClass() {
        return com.microblink.blinkcard.entities.recognizers.blinkcard.BlinkCardRecognizer.class;
    }
}