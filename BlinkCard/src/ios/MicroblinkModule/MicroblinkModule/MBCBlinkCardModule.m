#import "MBCOverlayViewControllerDelegate.h"
#import "MBCRecognizerSerializers.h"
#import "MBCOverlaySettingsSerializers.h"
#import "MBCRecognizerWrapper.h"
#import "MBCSerializationUtils.h"

#import <Foundation/Foundation.h>
#import "MBCBlinkCardModule.h"
#import <React/RCTConvert.h>
#import <BlinkCard/BlinkCard.h>

typedef NS_ENUM(NSUInteger, PPImageType) {
    PPImageTypeFace,
    PPImageTypeDocument,
    PPImageTypeSuccessful,
};

// NSError Domain
static NSString* const MBCErrorDomain = @"microblink.error";
static NSString* const RESULT_CAPTURED_FULL_IMAGE = @"capturedFullImage";
static NSString* const RESULT_DOCUMENT_CAPTURE_RECOGNIZER_RESULT = @"documentCaptureRecognizerResult";

@interface MBCBlinkCardModule () <MBCOverlayViewControllerDelegate>

@property (nonatomic, strong) MBCRecognizerCollection *recognizerCollection;
@property (nonatomic) id<MBCRecognizerRunnerViewController> scanningViewController;

@property (class, nonatomic, readonly) NSString *STATUS_SCAN_CANCELED;

@property (nonatomic, strong) RCTPromiseResolveBlock promiseResolve;
@property (nonatomic, strong) RCTPromiseRejectBlock promiseReject;

@end

@implementation MBCBlinkCardModule

RCT_EXPORT_MODULE(BlinkCardIos);

- (instancetype)init {
    if (self = [super init]) {
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

/**
 Method  sanitizes the dictionary replaces all occurances of NSNull with nil

 @param dictionary JSON objects
 @return new dictionary with NSNull values replaced with nil
 */
- (NSDictionary *)sanitizeDictionary:(NSDictionary *)dictionary {
    NSMutableDictionary *mutableDictionary = [[NSMutableDictionary alloc] initWithDictionary:dictionary];
    for (NSString* key in dictionary.allKeys) {
        if (mutableDictionary[key] == [NSNull null]) {
            mutableDictionary[key] = nil;
        }
    }
    return mutableDictionary;
}

RCT_REMAP_METHOD(scanWithCamera, scanWithCamera:(NSDictionary *)jsonOverlaySettings recognizerCollection:(NSDictionary *)jsonRecognizerCollection license:(NSDictionary *)jsonLicense resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {

    // Sanitize the dictionaries
    jsonOverlaySettings = [self sanitizeDictionary:jsonOverlaySettings];
    jsonRecognizerCollection = [self sanitizeDictionary:jsonRecognizerCollection];
    jsonLicense = [self sanitizeDictionary:jsonLicense];

    self.promiseResolve = resolve;
    self.promiseReject = reject;

    if ([jsonLicense objectForKey:@"showTrialLicenseWarning"] != nil) {
        BOOL showTrialLicenseWarning = [[jsonLicense objectForKey:@"showTrialLicenseWarning"] boolValue];
        [MBCMicroblinkSDK sharedInstance].showTrialLicenseWarning = showTrialLicenseWarning;
    }
    NSString* iosLicense = [jsonLicense objectForKey:@"licenseKey"];
    if ([jsonLicense objectForKey:@"licensee"] != nil) {
        NSString *licensee = [jsonLicense objectForKey:@"licensee"];
        [[MBCMicroblinkSDK sharedInstance] setLicenseKey:iosLicense andLicensee:licensee errorCallback:^(MBCLicenseError licenseError) {
        }];
    }
    else {
        [[MBCMicroblinkSDK sharedInstance] setLicenseKey:iosLicense errorCallback:^(MBCLicenseError licenseError) {
        }];
    }

    self.recognizerCollection = [[MBCRecognizerSerializers sharedInstance] deserializeRecognizerCollection:jsonRecognizerCollection];

    dispatch_sync(dispatch_get_main_queue(), ^{
        MBCOverlayViewController *overlayVC = [[MBCOverlaySettingsSerializers sharedInstance] createOverlayViewController:jsonOverlaySettings recognizerCollection:self.recognizerCollection delegate:self];

        UIViewController<MBCRecognizerRunnerViewController>* recognizerRunnerViewController = [MBCViewControllerFactory recognizerRunnerViewControllerWithOverlayViewController:overlayVC];
        self.scanningViewController = recognizerRunnerViewController;

        UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
        [rootViewController presentViewController:self.scanningViewController animated:YES completion:nil];
    });
}

- (void)overlayViewControllerDidFinishScanning:(MBCOverlayViewController *)overlayViewController state:(MBCRecognizerResultState)state {
    if (state != MBCRecognizerResultStateEmpty) {
        [overlayViewController.recognizerRunnerViewController pauseScanning];
        // recognizers within self.recognizerCollection now have their results filled

        BOOL isDocumentCaptureRecognizer = NO;

        NSMutableArray *jsonResults = [[NSMutableArray alloc] initWithCapacity:self.recognizerCollection.recognizerList.count];

        for (NSUInteger i = 0; i < self.recognizerCollection.recognizerList.count; ++i) {
            [jsonResults addObject:[[self.recognizerCollection.recognizerList objectAtIndex:i] serializeResult]];

        if (!isDocumentCaptureRecognizer) {
            self.promiseResolve(jsonResults);
        }
        // dismiss recognizer runner view controller
        dispatch_async(dispatch_get_main_queue(), ^{
            UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
            [rootViewController dismissViewControllerAnimated:YES completion:nil];
            self.recognizerCollection = nil;
            self.scanningViewController = nil;
            self.promiseResolve = nil;
            self.promiseReject = nil;
            });
        }
    }
}

- (void)overlayDidTapClose:(MBCOverlayViewController *)overlayViewController {
    UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
    [rootViewController dismissViewControllerAnimated:YES completion:nil];
    self.recognizerCollection = nil;
    self.scanningViewController = nil;
    NSError *error = [NSError errorWithDomain:MBCErrorDomain
                                         code:-58
                                     userInfo:nil];
    self.promiseReject(MBCBlinkCardModule.STATUS_SCAN_CANCELED, @"Scanning has been canceled", error);

    self.promiseResolve = nil;
    self.promiseReject = nil;
}

+ (NSString *)STATUS_SCAN_CANCELED {
    return @"STATUS_SCAN_CANCELED";
}

@end