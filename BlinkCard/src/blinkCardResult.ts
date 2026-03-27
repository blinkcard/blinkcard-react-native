import type {
  BlinkCardSingleSideScanningResult,
  CardAccountResult,
  CheckResult,
} from './types';

/**
 * Result of scanning a card.
 */
export class BlinkCardScanningResult {
  /**
   * Payment card's issuing network.
   */
  issuingNetwork: string;
  /**
   * A list of payment card accounts found on the card.
   * Each result in the list represents a distinct payment account,
   * containing details like the card number, CVV, and expiry date.
   *
   * See {@link CardAccountResult} for more information.
   */
  cardAccounts: [CardAccountResult];

  /**
   * The IBAN (International Bank Account Number) of the card, or null if not available.
   */
  iban?: string;

  /**
   * Information about the cardholder name, or null if not available.
   */
  cardholderName?: string;

  /**
   * The overall liveness check result for the card.
   *
   * This result aggregates the outcomes of various liveness checks performed on the card to determine its authenticity.
   *
   * Set to `pass` if all individual checks have passed;
   * set to `fail` if any individual check has failed.
   */
  overallCardLivenessResult: CheckResult;

  /**
   * The result of scanning the first side of the card
   * (side where the card number is located), or null if not scanned.
   *
   * See [BlinkCardSingleSideScanningResult] for more information.
   */
  firstSideResult?: BlinkCardSingleSideScanningResult;
  /**
   * The result of scanning the second side of the card, or null if not scanned.
   *
   * See {@link BlinkCardSingleSideScanningResult} for more information.
   */
  secondSideResult?: BlinkCardSingleSideScanningResult;

  constructor(nativeBlinkCardScanningResult: any) {
    this.issuingNetwork = nativeBlinkCardScanningResult.issuingNetwork;
    this.cardAccounts = nativeBlinkCardScanningResult.cardAccounts;
    this.iban = nativeBlinkCardScanningResult.iban;
    this.cardholderName = nativeBlinkCardScanningResult.cardholderName;
    this.overallCardLivenessResult =
      nativeBlinkCardScanningResult.overallCardLivenessResult;
    this.firstSideResult = nativeBlinkCardScanningResult.firstSideResult;
    this.secondSideResult = nativeBlinkCardScanningResult.secondSideResult;
  }
}
