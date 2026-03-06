package com.blinkcardreactnativereactnative

import com.facebook.react.bridge.ReactApplicationContext

class BlinkcardReactNativeReactNativeModule(reactContext: ReactApplicationContext) :
  NativeBlinkcardReactNativeReactNativeSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeBlinkcardReactNativeReactNativeSpec.NAME
  }
}
