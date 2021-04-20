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
 * Supported Legacy BlinkCard card issuer values.
 */
export const LegacyCardIssuer = Object.freeze(
    {
        /** Unidentified Card */
        Other: 1,
        /** The American Express Company Card */
        AmericanExpress: 2,
        /** The Bank of Montreal ABM Card */
        BmoAbm: 3,
        /** China T-Union Transportation Card */
        ChinaTUnion: 4,
        /** China UnionPay Card */
        ChinaUnionPay: 5,
        /** Canadian Imperial Bank of Commerce Advantage Debit Card */
        CibcAdvantageDebit: 6,
        /** CISS Card */
        Ciss: 7,
        /** Diners Club International Card */
        DinersClubInternational: 8,
        /** Diners Club United States & Canada Card */
        DinersClubUsCanada: 9,
        /** Discover Card */
        DiscoverCard: 10,
        /** HSBC Bank Canada Card */
        Hsbc: 11,
        /** RuPay Card */
        RuPay: 12,
        /** InterPayment Card */
        InterPayment: 13,
        /** InstaPayment Card */
        InstaPayment: 14,
        /** The JCB Company Card */
        Jcb: 15,
        /** Laser Debit Card (deprecated) */
        Laser: 16,
        /** Maestro Debit Card */
        Maestro: 17,
        /** Dankort Card */
        Dankort: 18,
        /** MIR Card */
        Mir: 19,
        /** MasterCard Inc. Card */
        MasterCard: 20,
        /** The Royal Bank of Canada Client Card */
        RbcClient: 21,
        /** ScotiaBank Scotia Card */
        ScotiaBank: 22,
        /** TD Canada Trust Access Card */
        TdCtAccess: 23,
        /** Troy Card */
        Troy: 24,
        /** Visa Inc. Card */
        Visa: 25,
        /** Universal Air Travel Plan Inc. Card */
        Uatp: 26,
        /** Interswitch Verve Card */
        Verve: 27
    }
);

/**
 * Supported BlinkCard card issuer values.
 */
export const Issuer = Object.freeze(
    {
        /* Unidentified Card */
        Other: 1,
        /* The American Express Company Card */
        AmericanExpress: 2,
        /* China UnionPay Card */
        ChinaUnionPay: 3,
        /* Diners Club International Card */
        Diners: 4,
        /* Discover Card */
        DiscoverCard: 5,
        /* Elo card association */
        Elo: 6,
        /* The JCB Company Card */
        Jcb: 7,
        /* Maestro Debit Card */
        Maestro: 8,
        /* Mastercard Inc. Card */
        Mastercard: 9,
        /* RuPay */
        RuPay: 10,
        /* Interswitch Verve Card */
        Verve: 11,
        /* Visa Inc. Card */
        Visa: 12,
        /* VPay */
        VPay: 13
    }
);

/**
 * Supported BLinkCard processing status
 */
export const BlinkCardProcessingStatus = Object.freeze(
    {
        /** Recognition was successful. */
        Success: 1,
        /** Detection of the document failed. */
        DetectionFailed: 2,
        /** Preprocessing of the input image has failed. */
        ImagePreprocessingFailed: 3,
        /** Recognizer has inconsistent results. */
        StabilityTestFailed: 4,
        /** Wrong side of the document has been scanned. */
        ScanningWrongSide: 5,
        /** Identification of the fields present on the document has failed. */
        FieldIdentificationFailed: 6,
        /** Failed to return a requested image. */
        ImageReturnFailed: 7,
        /** Payment card currently not supported by the recognizer. */
        UnsupportedCard: 8
    }
);

/**
 * Determines which data is anonymized in the returned recognizer result.
 */
export const BlinkCardAnonymizationMode = Object.freeze(
    {
        /** No anonymization is performed in this mode. */
        None: 1,

        /** Sensitive data in the document image is anonymized with black boxes covering selected sensitive data. Data returned in result fields is not changed. */
        ImageOnly: 2,

        /** Document image is not changed. Data returned in result fields is redacted. */
        ResultFieldsOnly: 3,

        /** Sensitive data in the image is anonymized with black boxes covering selected sensitive data. Data returned in result fields is redacted. */
        FullResult: 4
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
export const DataMatchResult = Object.freeze(
    {
        /** Data matching has not been performed. */
        NotPerformed : 1,
        /** Data does not match. */
        Failed : 2,
        /** Data match. */
        Success : 3
    }
);