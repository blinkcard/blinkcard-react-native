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
 * Result object for LegacyBlinkCardRecognizer.
 */
export class LegacyBlinkCardRecognizerResult extends RecognizerResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
        
        /**
         * The payment card number.
         */
        this.cardNumber = nativeResult.cardNumber;
        
        /**
         *  Payment card's security code/value
         */
        this.cvv = nativeResult.cvv;
        
        /**
         * Returns CDataMatchResultSuccess if data from scanned parts/sides of the document match,
         * CDataMatchResultFailed otherwise. For example if date of expiry is scanned from the front and back side
         * of the document and values do not match, this method will return CDataMatchResultFailed. Result will
         * be CDataMatchResultSuccess only if scanned values for all fields that are compared are the same.
         */
        this.documentDataMatch = nativeResult.documentDataMatch;
        
        /**
         * back side image of the document if enabled with returnFullDocumentImage property.
         */
        this.fullDocumentBackImage = nativeResult.fullDocumentBackImage;
        
        /**
         * front side image of the document if enabled with returnFullDocumentImage property.
         */
        this.fullDocumentFrontImage = nativeResult.fullDocumentFrontImage;
        
        /**
         * Payment card's IBAN
         */
        this.iban = nativeResult.iban;
        
        /**
         * Payment card's inventory number.
         */
        this.inventoryNumber = nativeResult.inventoryNumber;
        
        /**
         * Payment card's issuing network
         */
        this.issuer = nativeResult.issuer;
        
        /**
         * Information about the payment card owner (name, company, etc.).
         */
        this.owner = nativeResult.owner;
        
        /**
         * Returns true if recognizer has finished scanning first side and is now scanning back side,
         * false if it's still scanning first side.
         */
        this.scanningFirstSideDone = nativeResult.scanningFirstSideDone;
        
        /**
         * The payment card's last month of validity.
         */
        this.validThru = nativeResult.validThru != null ? new Date(nativeResult.validThru) : null;
        
    }
}

/**
 * Recognizer used for scanning the front side of credit/debit cards.
 */
export class LegacyBlinkCardRecognizer extends Recognizer {
    constructor() {
        super('LegacyBlinkCardRecognizer');
        
        /**
         * Should anonymize the card number area (redact image pixels) on the document image result
         * 
         * 
         */
        this.anonymizeCardNumber = false;
        
        /**
         * Should anonymize the CVV on the document image result
         * 
         * 
         */
        this.anonymizeCvv = false;
        
        /**
         * Should anonymize the IBAN area (redact image pixels) on the document image result
         * 
         * 
         */
        this.anonymizeIban = false;
        
        /**
         * Should anonymize the owner area (redact image pixels) on the document image result
         * 
         * 
         */
        this.anonymizeOwner = false;
        
        /**
         * Defines if glare detection should be turned on/off.
         * 
         * 
         */
        this.detectGlare = true;
        
        /**
         * Should extract CVV
         * 
         * 
         */
        this.extractCvv = true;
        
        /**
         * Should extract the payment card's IBAN
         * 
         * 
         */
        this.extractIban = false;
        
        /**
         * Should extract the card's inventory number
         * 
         * 
         */
        this.extractInventoryNumber = true;
        
        /**
         * Should extract the card owner information
         * 
         * 
         */
        this.extractOwner = false;
        
        /**
         * Should extract the payment card's month of expiry
         * 
         * 
         */
        this.extractValidThru = true;
        
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
         * Sets whether full document image of ID card should be extracted.
         * 
         * 
         */
        this.returnFullDocumentImage = false;
        
        this.createResultFromNative = function (nativeResult) { return new LegacyBlinkCardRecognizerResult(nativeResult); }
    }
}