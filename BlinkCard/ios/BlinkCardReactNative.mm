#import "BlinkCardReactNative.h"
#import "BlinkCardReactNative-Swift.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <BlinkCardReactNativeSpec/BlinkCardReactNativeSpec.h>
#endif

static NSString* const kBlinkCardModuleName = @"BlinkCardReactNative";
static NSString* const kBlinkCardError = @"blinkCardIosError";

@implementation BlinkCardReactNative {
    BlinkCardReactNativeModule *moduleImplementation;
}

-(instancetype) init {
    if (self = [super init]) {
        moduleImplementation = [BlinkCardReactNativeModule new];
    }
    return self;
}

RCT_EXPORT_MODULE(BlinkCardReactNative);

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeBlinkCardReactNativeSpecJSI>(params);
}
#endif


RCT_EXPORT_METHOD(loadSdk:(nonnull NSString *)blinkCardSdkSettings resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    [moduleImplementation loadSdkWithBlinkCardSdkSettings: [self createDictionaryFromBlinkCardJson:blinkCardSdkSettings]
    onResolve:^(NSString * _Nonnull) {
        resolve(@"");
    } onReject:^(NSString * _Nonnull error) {
        reject(kBlinkCardError, error, nil);
    }];
});

RCT_EXPORT_METHOD(performDirectApiScan:(nonnull NSString *)blinkCardSdkSettings blinkCardSessionSettings:(nonnull NSString *)blinkCardSessionSettings firstSideImage:(nonnull NSString *)firstSideImage secondSideImage:(NSString * _Nullable)secondSideImage resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    
    [moduleImplementation
     performDirectApiScanWithBlinkCardSdkSettings:
     [self createDictionaryFromBlinkCardJson:blinkCardSdkSettings]
     blinkCardSessionSettings:[self createDictionaryFromBlinkCardJson:blinkCardSessionSettings]
     firstSideImage:firstSideImage
     secondSideImage:secondSideImage
     
     onResolve:^(NSString * _Nonnull result) {
        resolve(@[result]);
    } onReject:^(NSString * _Nonnull error) {
        reject(kBlinkCardError, error, nil);
    }];
});

RCT_EXPORT_METHOD(performScan:(nonnull NSString *)blinkCardSdkSettings blinkCardSessionSettings:(nonnull NSString *)blinkCardSessionSettings scanningUxSettings:(NSString * _Nullable)scanningUxSettings resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIWindow *keyWindow = nil;
        
        for (UIWindowScene *scene in [UIApplication sharedApplication].connectedScenes) {
            if (scene.activationState == UISceneActivationStateForegroundActive &&
                [scene isKindOfClass:[UIWindowScene class]]) {
                for (UIWindow *window in scene.windows) {
                    if (window.isKeyWindow) {
                        keyWindow = window;
                        break;
                    }
                }
            }
            if (keyWindow) {
                break;
            }
        }
        
        [self->moduleImplementation
         performScanWithBlinkCardSdkSettings:[self createDictionaryFromBlinkCardJson:blinkCardSdkSettings]
         blinkCardSessionSettings:[self createDictionaryFromBlinkCardJson:blinkCardSessionSettings]
         scanningUxSettings:[self createDictionaryFromBlinkCardJson:scanningUxSettings]
         rootViewController:keyWindow.rootViewController
         onResolve:^(NSString * _Nonnull result) {
            resolve(@[result]);
        } onReject:^(NSString * _Nonnull error) {
            reject(kBlinkCardError, error, nil);
        }];
    });

});

RCT_EXPORT_METHOD(unloadSdk:(BOOL)deleteCachedResources resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    [moduleImplementation
     unloadSdkWithDeleteCachedResources:deleteCachedResources
     onResolve:^(NSString * _Nonnull) {
        resolve(@"");
    } onReject:^(NSString * _Nonnull error) {
        reject(kBlinkCardError, error, nil);
    }];
});

-(NSDictionary *)createDictionaryFromBlinkCardJson:(NSString *)json {
    NSError *jsonError;
    
    NSData *data = [json dataUsingEncoding:kCFStringEncodingUTF8];
    if (!data) {
        return nil;
    }
    
    return [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:&jsonError];
}

@end
