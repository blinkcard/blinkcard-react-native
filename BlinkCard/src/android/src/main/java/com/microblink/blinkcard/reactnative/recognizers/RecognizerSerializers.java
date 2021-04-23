package com.microblink.blinkcard.reactnative.recognizers;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.microblink.blinkcard.entities.recognizers.Recognizer;
import com.microblink.blinkcard.entities.recognizers.RecognizerBundle;
import com.microblink.blinkcard.reactnative.recognizers.serialization.*;

import java.util.HashMap;

public enum RecognizerSerializers {
    INSTANCE;

    private HashMap<String, RecognizerSerialization> recognizersByJSONName = new HashMap<>();
    private HashMap<Class<?>, RecognizerSerialization> recognizersByClass = new HashMap<>();

    RecognizerSerializers() {
        registerMapping(new SuccessFrameGrabberRecognizerSerialization());
        registerMapping(new BlinkCardRecognizerSerialization());
        registerMapping(new LegacyBlinkCardEliteRecognizerSerialization());
        registerMapping(new LegacyBlinkCardRecognizerSerialization());
    }

    private void registerMapping( RecognizerSerialization recognizerSerialization ) {
        recognizersByJSONName.put(recognizerSerialization.getJsonName(), recognizerSerialization);
        recognizersByClass.put(recognizerSerialization.getRecognizerClass(), recognizerSerialization);
    }


    public RecognizerSerialization getRecognizerSerialization(ReadableMap jsonRecognizer) {
        return recognizersByJSONName.get(jsonRecognizer.getString("recognizerType"));
    }

    public RecognizerSerialization getRecognizerSerialization(Recognizer<?> recognizer) {
        return recognizersByClass.get(recognizer.getClass());
    }

    public RecognizerBundle deserializeRecognizerCollection(ReadableMap jsonRecognizerCollection) {
        ReadableArray recognizerArray = jsonRecognizerCollection.getArray("recognizerArray");
        int numRecognizers = recognizerArray.size();
        Recognizer<?>[] recognizers = new Recognizer[numRecognizers];
        for (int i = 0; i < numRecognizers; ++i) {
            recognizers[ i ] = getRecognizerSerialization(recognizerArray.getMap(i)).createRecognizer(recognizerArray.getMap(i));
        }
        RecognizerBundle recognizerBundle = new RecognizerBundle(recognizers);

        if (jsonRecognizerCollection.hasKey("allowMultipleResults")) {
            recognizerBundle.setAllowMultipleScanResultsOnSingleImage(jsonRecognizerCollection.getBoolean("allowMultipleResults"));
        }
        if (jsonRecognizerCollection.hasKey("milisecondsBeforeTimeout")) {
            recognizerBundle.setNumMsBeforeTimeout(jsonRecognizerCollection.getInt("milisecondsBeforeTimeout"));
        }
        return recognizerBundle;
    }

    public WritableArray serializeRecognizerResults(Recognizer<?>[] recognizers) {
        WritableArray jsonArray = new WritableNativeArray();

        for (Recognizer<?> recognizer : recognizers) {
            jsonArray.pushMap(getRecognizerSerialization(recognizer).serializeResult(recognizer));
        }

        return jsonArray;
    }

}