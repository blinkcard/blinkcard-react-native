import { Recognizer, RecognizerResult } from '../recognizer'
import {
    Date,
    BlinkCardAnonymizationSettings,
    BlinkCardMatchLevel,
    ImageExtensionFactors,
    BlinkCardDetectionLevel,
} from '../types'

/**
 * Result object for BlinkCardRecognizer.
 */
export class BlinkCardRecognizerResult extends RecognizerResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);

        /**
         * The payment card number.
         */
        this.cardNumber = nativeResult.cardNumber;

        /**
         * The payment card number prefix.
         */
        this.cardNumberPrefix = nativeResult.cardNumberPrefix;

        /**
         * The payment card number is valid
         */
        this.cardNumberValid = nativeResult.cardNumberValid;

        /**
         *  Payment card's security code/value.
         */
        this.cvv = nativeResult.cvv;

        /**
         * Document liveness check (screen, photocopy, hand presence) which can pass or fail.
         */
        this.documentLivenessCheck = nativeResult.documentLivenessCheck;

        /**
         * The payment card's expiry date.
         */
        this.expiryDate = nativeResult.expiryDate != null ? new Date(nativeResult.expiryDate) : null;

        /**
         * Whether the first scanned side is anonymized.
         */
        this.firstSideAnonymized = nativeResult.firstSideAnonymized;

        /**
         * Whether the first scanned side is blurred.
         */
        this.firstSideBlurred = nativeResult.firstSideBlurred;

        /**
         * Full image of the payment card from first side recognition.
         */
        this.firstSideFullDocumentImage = nativeResult.firstSideFullDocumentImage;

        /**
         * Payment card's IBAN.
         */
        this.iban = nativeResult.iban;

        /**
         * Payment card's issuing network.
         */
        this.issuer = nativeResult.issuer;

        /**
         * Information about the payment card owner (name, company, etc.).
         */
        this.owner = nativeResult.owner;

        /**
         * Status of the last recognition process.
         */
        this.processingStatus = nativeResult.processingStatus;

        /**
         * Returns true if recognizer has finished scanning first side and is now scanning back side,
         * false if it's still scanning first side.
         */
        this.scanningFirstSideDone = nativeResult.scanningFirstSideDone;

        /**
         * Whether the second scanned side is anonymized.
         */
        this.secondSideAnonymized = nativeResult.secondSideAnonymized;

        /**
         * Whether the second scanned side is blurred.
         */
        this.secondSideBlurred = nativeResult.secondSideBlurred;

        /**
         * Full image of the payment card from second side recognition.
         */
        this.secondSideFullDocumentImage = nativeResult.secondSideFullDocumentImage;

    }
}

/**
 * Recognizer used for scanning credit/debit cards.
 */
export class BlinkCardRecognizer extends Recognizer {
    constructor() {
        super('BlinkCardRecognizer');

        /**
         * Defines whether blured frames filtering is allowed
         * 
         * 
         */
        this.allowBlurFilter = true;

        /**
         * Whether invalid card number is accepted.
         * 
         * 
         */
        this.allowInvalidCardNumber = false;

        /**
         * Defines whether sensitive data should be redacted from the result.
         * 
         * 
         */
        this.anonymizationSettings = new BlinkCardAnonymizationSettings();

        /**
         * Should extract CVV
         * 
         * 
         */
        this.extractCvv = true;

        /**
         * Should extract the payment card's month of expiry
         * 
         * 
         */
        this.extractExpiryDate = true;

        /**
         * Should extract the payment card's IBAN
         * 
         * 
         */
        this.extractIban = true;

        /**
         * Should extract the card owner information
         * 
         * 
         */
        this.extractOwner = true;

        /**
         * Property for setting DPI for full document images
         * Valid ranges are [100,400]. Setting DPI out of valid ranges throws an exception
         * 
         * 
         */
        this.fullDocumentImageDpi = 250;

        /**
         * Image extension factors for full document image.
         * 
         * @see CImageExtensionFactors
         * 
         */
        this.fullDocumentImageExtensionFactors = new ImageExtensionFactors();

        /**
         * This parameter is used to adjust heuristics that eliminate cases when the hand is present.
         * 
         * 
         */
        this.handDocumentOverlapThreshold = 0.05;

        /**
         * Hand scale is calculated as a ratio between area of hand mask and document mask.
         * 
         * 
         */
        this.handScaleThreshold = 0.15;

        /**
         * Pading is a minimum distance from the edge of the frame and is defined as a percentage of the frame width. Default value is 0.0f and in that case
         * padding edge and image edge are the same.
         * Recommended value is 0.02f.
         * 
         * 
         */
        this.paddingEdge = 0.0;

        /**
         * Photocopy analysis match level - higher if stricter.
         * 
         * 
         */
        this.photocopyAnalysisMatchLevel = BlinkCardMatchLevel.Level5;

        /**
         * Sets whether full document image of ID card should be extracted.
         * 
         * 
         */
        this.returnFullDocumentImage = false;

        /**
         * Screen analysis match level - higher if stricter.
         * 
         * 
         */
        this.screenAnalysisMatchLevel = BlinkCardMatchLevel.Level5;

        /**
         * The level of allowed detected tilt of the document in the image.
         * 
         * Default: `BlinkCardDetectionLevel.Mid`
         */
        this.tiltDetectionLevel = BlinkCardDetectionLevel.Mid;

        this.createResultFromNative = function (nativeResult) { return new BlinkCardRecognizerResult(nativeResult); }
    }
}