#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <BlinkCardReactNativeSpec/BlinkCardReactNativeSpec.h>
#endif

@interface BlinkCardReactNative : RCTEventEmitter <RCTBridgeModule>
@end

#ifdef RCT_NEW_ARCH_ENABLED
@interface BlinkCardReactNative () <NativeBlinkCardReactNativeSpec>
@end
#endif
