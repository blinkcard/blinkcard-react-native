package com.microblink.blinkcard.reactnative.overlays.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.microblink.blinkcard.hardware.camera.CameraType;
import com.microblink.blinkcard.reactnative.R;
import com.microblink.blinkcard.uisettings.CameraSettings;
import com.microblink.blinkcard.uisettings.UISettings;
import com.microblink.blinkcard.uisettings.options.BeepSoundUIOptions;

public abstract class OverlaySerializationUtils {
    public static void extractCommonUISettings(ReadableMap jsonOverlaySettings, UISettings uiSettings) {
        if (uiSettings instanceof BeepSoundUIOptions) {
            if (jsonOverlaySettings.hasKey("enableBeep")) {
                if (jsonOverlaySettings.getBoolean("enableBeep")) {
                    ((BeepSoundUIOptions)uiSettings).setBeepSoundResourceID(R.raw.beep);
                }
            }
        }
        if (jsonOverlaySettings.hasKey("useFrontCamera")
                && jsonOverlaySettings.getBoolean("useFrontCamera")) {
            CameraSettings cameraSettings = new CameraSettings.Builder()
                    .setType(CameraType.CAMERA_FRONTFACE)
                    .build();
            uiSettings.setCameraSettings(cameraSettings);
        }
    }
}