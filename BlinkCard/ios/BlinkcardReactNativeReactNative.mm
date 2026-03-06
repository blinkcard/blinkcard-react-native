#import "BlinkcardReactNativeReactNative.h"

@implementation BlinkcardReactNativeReactNative
- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeBlinkcardReactNativeReactNativeSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"BlinkcardReactNativeReactNative";
}

@end
