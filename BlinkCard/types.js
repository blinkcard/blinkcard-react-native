/**
 * Represents a date extracted from image.
 */
export class Date {
    constructor(nativeDate) {
        /** day in month */
        this.day = nativeDate.day;
        /** month in year */
        this.month = nativeDate.month;
        /** year */
        this.year = nativeDate.year;
        /** original date string */
        this.originalDateStringResult = nativeDate.originalDateStringResult;
        /** isFilledByDomainKnowledge */
        this.isFilledByDomainKnowledge = nativeDate.isFilledByDomainKnowledge;
    }
}

/**
 * Represents a point in image
 */
export class Point {
    constructor(nativePoint) {
        /** x coordinate of the point */
        this.x = nativePoint.x;
        /** y coordinate of the point */
        this.y = nativePoint.y;
    }
}

/**
 * Represents a quadrilateral location in the image
 */
export class Quadrilateral {
    constructor(nativeQuad) {
        /** upper left point of the quadrilateral */
        this.upperLeft = new Point(nativeQuad.upperLeft);
        /** upper right point of the quadrilateral */
        this.upperRight = new Point(nativeQuad.upperRight);
        /** lower left point of the quadrilateral */
        this.lowerLeft = new Point(nativeQuad.lowerLeft);
        /** lower right point of the quadrilateral */
        this.lowerRight = new Point(nativeQuad.lowerRight);
    }
}

/**
 * Defines possible Android device camera video resolution preset 
 */
export const AndroidCameraResolutionPreset = Object.freeze(
    {
        /** Will choose camera video resolution which is best for current device */
        PresetDefault: 0,

        /** Attempts to choose camera video resolution as closely as 480p */
        Preset480p: 1,

        /** Attempts to choose camera video resolution as closely as 720p */
        Preset720p: 2,

        /** Attempts to choose camera video resolution as closely as 1080p */
        Preset1080p: 3,

        /** Attempts to choose camera video resolution as closely as 2160p */
        Preset2160p: 4,

        /** Will choose max available camera video resolution */
        PresetMaxAvailable: 5
    }
);

/**
 * Defines possible iOS device camera video resolution preset 
 */
export const iOSCameraResolutionPreset = Object.freeze(
    {
        /** 480p video will always be used */
        Preset480p: 0,

        /** 720p video will always be used */
        Preset720p: 1,

        /** 1080p video will always be used */
        Preset1080p: 2,

        /** 4K video will always be used */
        Preset4K: 3,

        /** The library will calculate optimal resolution based on the use case and device used */
        PresetOptimal: 4,

        /** Device's maximal video resolution will be used */
        PresetMax: 5,

        /** Device's photo preview resolution will be used */
        PresetPhoto: 6
    }

);





/**
 * Supported BlinkCard card issuer values.
 */
export const Issuer = Object.freeze(
    {
        /* Unidentified Card */
        Other: 0,
        /* The American Express Company Card */
        AmericanExpress: 1,
        /* China UnionPay Card */
        ChinaUnionPay: 2,
        /* Diners Club International Card */
        Diners: 3,
        /* Discover Card */
        DiscoverCard: 4,
        /* Elo card association */
        Elo: 5,
        /* The JCB Company Card */
        Jcb: 6,
        /* Maestro Debit Card */
        Maestro: 7,
        /* Mastercard Inc. Card */
        Mastercard: 8,
        /* RuPay */
        RuPay: 9,
        /* Interswitch Verve Card */
        Verve: 10,
        /* Visa Inc. Card */
        Visa: 11,
        /* VPay */
        VPay: 12
    }
);

/**
 * Supported BLinkCard processing status
 */
export const BlinkCardProcessingStatus = Object.freeze(
    {
        /** Recognition was successful. */
        Success: 0,
        /** Detection of the document failed. */
        DetectionFailed: 1,
        /** Preprocessing of the input image has failed. */
        ImagePreprocessingFailed: 2,
        /** Recognizer has inconsistent results. */
        StabilityTestFailed: 3,
        /** Wrong side of the document has been scanned. */
        ScanningWrongSide: 4,
        /** Identification of the fields present on the document has failed. */
        FieldIdentificationFailed: 5,
        /** Failed to return a requested image. */
        ImageReturnFailed: 6,
        /** Payment card currently not supported by the recognizer. */
        UnsupportedCard: 7
    }
);

/**
 *Enumerates the possible match levels indicating the strictness of a check result. Higher is stricter.
 */
export const BlinkCardMatchLevel = Object.freeze(
    {
        /** Match level is disabled */
        Disabled: 0,
        /** Match level one. */
        Level1: 1,
        /** Match level two */
        Level2: 2,
        /** Match level three */
        Level3: 3,
        /** Match level four */
        Level4: 4,
        /** Match level five */
        Level5: 5,
        /** Match level six */
        Level6: 6,
        /** Match level seven */
        Level7: 7,
        /** Match level eight */
        Level8: 8,
        /** Match level nine */
        Level9: 9,
        /** Match level ten. Most strict match level */
        Level10: 10
    }
);

/**
 * Represents the different levels of detection sensitivity.
 */
export const BlinkCardDetectionLevel = Object.freeze(
    {
        Off: 0,

        Low: 1,

        Mid: 2,

        High: 3,
    }
);

/**
 * Enumerates the possible results of BlinkCard's document liveness checks.
 */
export const BlinkCardCheckResult = Object.freeze(
    {
        /** Indicates that the check was not performed. */
        NotPerformed: 0,
        /** Indicates that the document passed the check successfully. */
        Pass: 1,
        /** Indicates that the document failed the check. */
        Fail: 2,
    }
);

/**
 * Determines which data is anonymized in the returned recognizer result.
 */
export const BlinkCardAnonymizationMode = Object.freeze(
    {
        /** No anonymization is performed in this mode. */
        None: 0,

        /** Sensitive data in the document image is anonymized with black boxes covering selected sensitive data. Data returned in result fields is not changed. */
        ImageOnly: 1,

        /** Document image is not changed. Data returned in result fields is redacted. */
        ResultFieldsOnly: 2,

        /** Sensitive data in the image is anonymized with black boxes covering selected sensitive data. Data returned in result fields is redacted. */
        FullResult: 3
    }
);

/**
 * Holds the settings which control card number anonymization.
 */
export class CardNumberAnonymizationSettings {
    constructor() {
        /** Defines the mode of card number anonymization. */
        this.mode = BlinkCardAnonymizationMode.None;
        /** Defines how many digits at the beginning of the card number remain visible after anonymization. */
        this.prefixDigitsVisible = 0;
        /** Defines how many digits at the end of the card number remain visible after anonymization. */
        this.suffixDigitsVisible = 0;
    }
}

/**
 * Holds the settings which control card anonymization.
 */
export class BlinkCardAnonymizationSettings {
    constructor() {
        /** Defines the parameters of card number anonymization. */
        this.cardNumberAnonymizationSettings = new CardNumberAnonymizationSettings();
        /** Defines the mode of card number prefix anonymization. */
        this.cardNumberPrefixAnonymizationMode = BlinkCardAnonymizationMode.None;
        /** Defines the mode of CVV anonymization. */
        this.cvvAnonymizationMode = BlinkCardAnonymizationMode.None;
        /** Defines the mode of IBAN anonymization. */
        this.ibanAnonymizationMode = BlinkCardAnonymizationMode.None;
        /** Defines the mode of owner anonymization. */
        this.ownerAnonymizationMode = BlinkCardAnonymizationMode.None;
    }
}
/**
 * Extension factors relative to corresponding dimension of the full image. For example,
 * upFactor and downFactor define extensions relative to image height, e.g.
 * when upFactor is 0.5, upper image boundary will be extended for half of image's full
 * height.
 */
export class ImageExtensionFactors {
    constructor() {
        /** image extension factor relative to full image height in UP direction. */
        this.upFactor = 0.0;
        /** image extension factor relative to full image height in RIGHT direction. */
        this.rightFactor = 0.0;
        /** image extension factor relative to full image height in DOWN direction. */
        this.downFactor = 0.0;
        /** image extension factor relative to full image height in LEFT direction. */
        this.leftFactor = 0.0;
    }
};

/** Result of the data matching algorithm for scanned parts/sides of the document. */
export const DataMatchState = Object.freeze(
    {
        /** Data matching has not been performed. */
        NotPerformed: 0,
        /** Data does not match. */
        Failed: 1,
        /** Data match. */
        Success: 2
    }
);