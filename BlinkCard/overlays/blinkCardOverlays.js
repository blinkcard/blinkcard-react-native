import { OverlaySettings } from '../overlaySettings'
import { AndroidCameraResolutionPreset, 
        iOSCameraResolutionPreset
    } from '../types'
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
        /**
        * String: Instructions for the user to move the document closer
        * 
        * If null, default value will be used.
        */
        this.errorMoveCloser = null;
        /**
        * String: Instructions for the user to move the document farther
        * 
        * If null, default value will be used.
        */
        this.errorMoveFarther = null;
        /**
        * String: Instructions for the user to move the document from the edge
        * 
        * If null, default value will be used.
        */
        this.errorCardTooCloseToEdge = null;
        /**
        * String: Instructions for the user when wrong side is being scanned.
        * 
        * If null, default value will be used.
        */
        this.scanningWrongSideMessage = null;
        /**
        * Defines whether button for presenting onboarding screens will be present on screen
        * 
        * Default: true
        */
        this.showOnboardingInfo = true;
        /**
        * Defines whether button for presenting onboarding screens will be present on screen
        * 
        * Default: true
        */
        this.showIntroductionDialog = true;
        /**
        * Option to configure when the onboarding help tooltip will appear. 
        * 
        * Default: 8000
        */
        this.onboardingButtonTooltipDelay = 8000;
        /**
        * Language of the UI. 
        * If default overlay contains textual information, text will be localized to this language. Otherwise device langauge will be used
        * example: "en" 
        */
        this.language = null;
        /**
        * Used with language variable, it defines the country locale 
        *
        * example: "US" to use "en_US" on Android and en-US on iOS
        */
        this.country = null;
        /**
         * Defines possible iOS device camera video resolution preset.
         * 
         * Default: PresetOptimal
         */
        this.iOSCameraResolutionPreset = iOSCameraResolutionPreset.PresetOptimal;
        /**
        * Defines possible Android device camera video resolution preset.
        * 
        * Default: PresetDefault
        */
        this.androidCameraResolutionPreset = AndroidCameraResolutionPreset.PresetDefault;
        /**
        * Option to set whether legacy camera API should be used even on Lollipop devices that support newer Camera2 API.
        * 
        * Default: false
        */
        this.enableAndroidLegacyCameraApi = false;
    }
}