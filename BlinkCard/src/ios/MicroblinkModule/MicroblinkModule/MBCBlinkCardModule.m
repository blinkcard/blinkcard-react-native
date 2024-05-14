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

@interface MBCBlinkCardModule () <MBCOverlayViewControllerDelegate, MBCScanningRecognizerRunnerDelegate, MBCFirstSideFinishedRecognizerRunnerDelegate>

@property (nonatomic, strong) MBCRecognizerCollection *recognizerCollection;
@property (nonatomic) id<MBCRecognizerRunnerViewController> scanningViewController;
@property (nonatomic, strong) MBCRecognizerRunner *recognizerRunner;
@property (nonatomic, strong) NSDictionary *backImageBase64Image;

@property (class, nonatomic, readonly) NSString *STATUS_SCAN_CANCELED;
@property (class, nonatomic, readonly) NSString *STATUS_FRONTSIDE_EMPTY;
@property (class, nonatomic, readonly) NSString *STATUS_BASE64_ERROR;
@property (class, nonatomic, readonly) NSString *STATUS_NO_DATA;

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
            [mutableDictionary removeObjectForKey:key];
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
    
    [self setupLicense:jsonLicense];
    [self setupLanguage:jsonOverlaySettings];

    self.recognizerCollection = [[MBCRecognizerSerializers sharedInstance] deserializeRecognizerCollection:jsonRecognizerCollection];

    dispatch_sync(dispatch_get_main_queue(), ^{
        MBCOverlayViewController *overlayVC = [[MBCOverlaySettingsSerializers sharedInstance] createOverlayViewController:jsonOverlaySettings recognizerCollection:self.recognizerCollection delegate:self];

        UIViewController<MBCRecognizerRunnerViewController>* recognizerRunnerViewController = [MBCViewControllerFactory recognizerRunnerViewControllerWithOverlayViewController:overlayVC];
        self.scanningViewController = recognizerRunnerViewController;

        UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
        [rootViewController presentViewController:self.scanningViewController animated:YES completion:nil];
    });
}

RCT_REMAP_METHOD(scanWithDirectApi, recognizerCollection:(NSDictionary *)jsonRecognizerCollection frontImage:(NSDictionary *)jsonFrontImage backImage:(NSDictionary*)jsonBackImage license:(NSDictionary *)jsonLicense resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // Sanitize the dictionaries
    jsonRecognizerCollection = [self sanitizeDictionary:jsonRecognizerCollection];
    jsonLicense = [self sanitizeDictionary:jsonLicense];
    jsonFrontImage = [self sanitizeDictionary: jsonFrontImage];
    self.backImageBase64Image = [self sanitizeDictionary:jsonBackImage];
    
    self.promiseResolve = resolve;
    self.promiseReject = reject;
    
    [self setupLicense:jsonLicense];
    [self setupRecognizerRunner:jsonRecognizerCollection];
    
    [self setupRecognizerRunner:jsonRecognizerCollection];
    if (jsonFrontImage[@"frontImage"] != nil) {
        UIImage *frontImage = [self convertbase64ToImage:jsonFrontImage[@"frontImage"]];
        if (!CGSizeEqualToSize(frontImage.size, CGSizeZero)) {
            [self processImage:frontImage];
        } else {
            [self handleDirectApiError:MBCBlinkCardModule.STATUS_BASE64_ERROR errorMessaege:@"Could not decode Base64 image!"];
        }
    } else {
        [self handleDirectApiError:MBCBlinkCardModule.STATUS_FRONTSIDE_EMPTY errorMessaege:@"The provided image for the 'frontImage' parameter is empty!"];
    }
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

- (void)recognizerRunnerDidFinishRecognitionOfFirstSide:(MBCRecognizerRunner *)recognizerRunner {
    if (self.backImageBase64Image[@"backImage"] != nil) {
        UIImage *backImage = [self convertbase64ToImage:self.backImageBase64Image[@"backImage"]];
        if (!CGSizeEqualToSize(backImage.size, CGSizeZero)) {
            [self processImage:backImage];
        } else {
            [self handleJsonResult];
            self.recognizerCollection = nil;
            self.recognizerRunner = nil;
        }
    } else {
        [self handleJsonResult];
        self.recognizerCollection = nil;
        self.recognizerRunner = nil;
    }
}

- (void)recognizerRunner:(nonnull MBCRecognizerRunner *)recognizerRunner didFinishScanningWithState:(MBCRecognizerResultState)state {
    dispatch_async(dispatch_get_main_queue(), ^{
        if (state == MBCRecognizerResultStateValid || state == MBCRecognizerResultStateUncertain) {
            [self handleJsonResult];
            self.recognizerCollection = nil;
            self.recognizerRunner = nil;
        } else if (state == MBCRecognizerResultStateEmpty) {
            [self handleDirectApiError:MBCBlinkCardModule.STATUS_NO_DATA errorMessaege:@"Could not extract the information with DirectAPI!"];
            self.recognizerCollection = nil;
            self.recognizerRunner = nil;
        }
    });
}

//setup the recognizer runner
- (void) setupRecognizerRunner:(NSDictionary *)jsonRecognizerCollection {
    self.recognizerCollection = [[MBCRecognizerSerializers sharedInstance] deserializeRecognizerCollection:jsonRecognizerCollection];
    self.recognizerRunner = [[MBCRecognizerRunner alloc] initWithRecognizerCollection:self.recognizerCollection];
    self.recognizerRunner.scanningRecognizerRunnerDelegate = self;
    self.recognizerRunner.metadataDelegates.firstSideFinishedRecognizerRunnerDelegate = self;
}

//convert the image to MBCImage and process it
- (void)processImage:(UIImage *)originalImage {
    MBCImage *image = [MBCImage imageWithUIImage:originalImage];
    image.cameraFrame = NO;
    image.orientation = MBCProcessingOrientationLeft;
    dispatch_queue_t _serialQueue = dispatch_queue_create("com.microblink.DirectAPI", DISPATCH_QUEUE_SERIAL);
    dispatch_async(_serialQueue, ^{
        [self.recognizerRunner processImage:image];
    });
}

//convert image from base64 to UIImage
-(UIImage*)convertbase64ToImage:(NSString *)base64Image {
    NSData *imageData = [[NSData alloc] initWithBase64EncodedString:base64Image options:NSDataBase64DecodingIgnoreUnknownCharacters];
    if (imageData) {
        UIImage *image = [UIImage imageWithData:imageData];
        return image;
    } else {
        return [UIImage new];
    }
}

//Handle JSON results
- (void) handleJsonResult {
    BOOL isDocumentCaptureRecognizer = NO;
    
    NSMutableArray *jsonResults = [[NSMutableArray alloc] initWithCapacity:self.recognizerCollection.recognizerList.count];
    
    for (NSUInteger i = 0; i < self.recognizerCollection.recognizerList.count; ++i) {
        [jsonResults addObject:[[self.recognizerCollection.recognizerList objectAtIndex:i] serializeResult]];
        
        if (!isDocumentCaptureRecognizer) {
            self.promiseResolve(jsonResults);
        }
    }
}

- (void) handleDirectApiError:(NSString*)status errorMessaege:(NSString *)errorMessage {
    self.recognizerCollection = nil;
    self.recognizerRunner = nil;
    NSError *error = [NSError errorWithDomain:MBCErrorDomain
                                         code:-58
                                     userInfo:nil];
    self.promiseReject(status, errorMessage, error);
    self.promiseResolve = nil;
    self.promiseReject = nil;
}

- (void) setupLicense:(NSDictionary *)jsonLicense {
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
}

- (void) setupLanguage:(NSDictionary *)jsonOverlaySettings {
    if (jsonOverlaySettings[@"language"] != nil) {
        if (jsonOverlaySettings[@"country"] != nil && ![jsonOverlaySettings[@"country"]  isEqual: @""]) {
            MBCMicroblinkApp.sharedInstance.language = [[(NSString *)jsonOverlaySettings[@"language"] stringByAppendingString:@"-" ] stringByAppendingString:(NSString *)jsonOverlaySettings[@"country"]];
        } else {
            MBCMicroblinkApp.sharedInstance.language = jsonOverlaySettings[@"language"];
        }
    }
}

+ (NSString *)STATUS_FRONTSIDE_EMPTY {
    return @"STATUS_FRONTSIDE_EMPTY";
}

+ (NSString *)STATUS_BASE64_ERROR {
    return @"STATUS_BASE64_ERROR";
}

+ (NSString *)STATUS_NO_DATA {
    return @"STATUS_NO_DATA";
}

+ (NSString *)STATUS_SCAN_CANCELED {
    return @"STATUS_SCAN_CANCELED";
}

@end