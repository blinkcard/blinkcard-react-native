import { OverlaySettings } from '../overlaySettings'

/**
 * Class for setting up BlinkCard overlay.
 * BlinkCard overlay is best suited for scanning payment cards.
 */
export class BlinkCardOverlaySettings extends OverlaySettings {
    constructor() {
        super('BlinkCardOverlaySettings');
        /**
         * String: user instructions that are shown above camera preview while the first side of the
         * document is being scanned.
         * If null, default value will be used.
         */
        this.firstSideInstructions = null;
        /**
         * String: user instructions that are shown above camera preview while the second side of the
         * document is being scanned.
         * If null, default value will be used.
         */
        this.flipCardInstructions = null;
        /**
        * Defines whether glare warning will be displayed when user turn on a flashlight
        *
        * Default: true
        */
        this.showFlashlightWarning = true;
    }
}