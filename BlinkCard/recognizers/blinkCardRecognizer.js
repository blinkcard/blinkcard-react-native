import { Recognizer, RecognizerResult } from '../recognizer'
import {
    Date,
    Point,
    Quadrilateral,
    
    
    LegacyCardIssuer,
    Issuer,
    BlinkCardProcessingStatus,
    BlinkCardAnonymizationMode,
    CardNumberAnonymizationSettings,
    BlinkCardAnonymizationSettings,
    ImageExtensionFactors,
    DataMatchResult,
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
         * Flag which indicatew whether the payment card number is valid or not.
         */
        this.cardNumberValid = nativeResult.cardNumberValid;
        
        /**
         * Payment card's security code/value.
         */
        this.cvv = nativeResult.cvv;
        
        /**
         * Defines digital signature of recognition results.
         */
        this.digitalSignature = nativeResult.digitalSignature;
        
        /**
         * Defines digital signature version.
         */
        this.digitalSignatureVersion = nativeResult.digitalSignatureVersion;
        
        /**
         * The payment card's expiry date.
         */
        this.expiryDate = nativeResult.expiryDate != null ? new Date(nativeResult.expiryDate) : null;
        
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
         * Information about the payment card owner.
         */
        this.owner = nativeResult.owner;
        
        /**
         * Status of the last recognition process.
         */
        this.processingStatus = nativeResult.processingStatus;
        
        /**
         * {true} if recognizer has finished scanning first side and is now scanning back side,
         */
        this.scanningFirstSideDone = nativeResult.scanningFirstSideDone;
        
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
 * Recognizer used for scanning both sides of payment cards.
 */
export class BlinkCardRecognizer extends Recognizer {
    constructor() {
        super('BlinkCardRecognizer');
        
        /**
         * Whether blured frames filtering is allowed.
         */
        this.allowBlurFilter = true;
        
        /**
         * The settings which control the anonymization of returned data.
         */
        this.anonymizationSettings = new BlinkCardAnonymizationSettings();
        
        /**
         * Should extract the card CVV
         */
        this.extractCvv = true;
        
        /**
         * Should extract the payment card's expiry date.
         */
        this.extractExpiryDate = true;
        
        /**
         * Should extract the card IBAN
         */
        this.extractIban = true;
        
        /**
         * Should extract the card owner information
         */
        this.extractOwner = true;
        
        /**
         * The DPI (Dots Per Inch) for full document image that should be returned.
         */
        this.fullDocumentImageDpi = 250;
        
        /**
         * The extension factors for full document image.
         */
        this.fullDocumentImageExtensionFactors = new ImageExtensionFactors();
        
        /**
         * Padding is a minimum distance from the edge of the frame and it is defined as a percentage
         */
        this.paddingEdge = 0.0;
        
        /**
         * Defines whether full document image will be available in
         */
        this.returnFullDocumentImage = false;
        
        /**
         * Defines whether or not recognition result should be signed.
         */
        this.signResult = false;
        
        this.createResultFromNative = function (nativeResult) { return new BlinkCardRecognizerResult(nativeResult); }
    }
}