/**
 * Sample React Native App for BlinkCard
 * https://github.com/BlinkCard/blinkcard-react-native
 */

import React, { Component } from 'react';
import * as BlinkCardReactNative from '@microblink/blinkcard-react-native';
import {
    AppRegistry,
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Button
} from 'react-native';

const licenseKey = Platform.select({
    // iOS license key for applicationID: com.microblink.sample
    ios: 'sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUBbGV5SkRjbVZoZEdWa1QyNGlPakUzTURnMk9EWTNOalE0TURZc0lrTnlaV0YwWldSR2IzSWlPaUkwT1RabFpEQXpaUzAwT0RBeExUUXpZV1F0WVRrMU5DMDBNemMyWlRObU9UTTVNR1FpZlE9Pc2TFqY01wri2M94Fe5sCUOx4F7K3M5TXqNAAJZWrZrJijNfC57WBNQMo7GkQo9Fp6zemUCuWlW0XGzB0RqVzCG1Y8aztpnim/cOYMPi5xoqZm3O3DeSkjmH6qUIyg==',
    // android license key for applicationID: com.microblink.sample
    android: 'sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUAbGV5SkRjbVZoZEdWa1QyNGlPakUzTURnMk9EWTNPRGcwT1Rrc0lrTnlaV0YwWldSR2IzSWlPaUkwT1RabFpEQXpaUzAwT0RBeExUUXpZV1F0WVRrMU5DMDBNemMyWlRObU9UTTVNR1FpZlE9PUwdDoL/tBLmwfbOm3/dmw5DjLaYtTz1AGwI1162GlPEct+8fJxPBysGwVZ/8KX0Ygxi7NeroVHPM6IDNhCkmUMDHqELYqH3nK8xm8FPaTjCcN53o3B40SKVLm1Quw=='
})


var renderIf = function(condition, content) {
    if (condition) {
        return content;
    } 
    return null;
}

function buildResult(result, key) {
    if (result && result != -1) {
        return key + ": " + result + "\n";
    }
    return ""
}

function buildLivenessResult(result, key) {
    if (result && result !== -1) {
        return key + ": " + "\n" +
            buildResult(result.handPresenceCheck.toString(), 'Hand presence check') +
            buildResult(result.photocopyCheck.toString(), 'Photocopy check') +
            buildResult(result.screenCheck.toString(), 'Screen check');
    }
    return "";
}

function buildDateResult(result, key) {
    if (result) {
        return key + ": " +
            result.day + "." + result.month + "." + result.year + "."
            + "\n";
    }
    return ""
}

export default class Sample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showFirstImageDocument: false,
            resultFirstImageDocument: '',
            showSecondImageDocument: false,
            resultSecondImageDocument: '',
            results: '',
            licenseKeyErrorMessage: ''
        };
    }

    async scan() {
        try {
            var blinkCardRecognizer = new BlinkCardReactNative.BlinkCardRecognizer();
            blinkCardRecognizer.returnFullDocumentImage = true;

            const scanningResults = await BlinkCardReactNative.BlinkCard.scanWithCamera(
                new BlinkCardReactNative.BlinkCardOverlaySettings(),
                new BlinkCardReactNative.RecognizerCollection([blinkCardRecognizer]),
                licenseKey
            );

            if (scanningResults) {
                let newState = {
                    showFirstImageDocument: false,
                    resultFirstImageDocument: '',
                    showSecondImageDocument: false,
                    resultSecondImageDocument: '',
                    results: ''
                };

                for (let i = 0; i < scanningResults.length; ++i) {
                    let localState = this.handleResult(scanningResults[i]);
                    newState.showFirstImageDocument = newState.showFirstImageDocument || localState.showFirstImageDocument;
                    if (localState.showFirstImageDocument) {
                        newState.resultFirstImageDocument = localState.resultFirstImageDocument;
                    }
                    newState.showSecondImageDocument = newState.showSecondImageDocument || localState.showSecondImageDocument;
                    if (localState.showSecondImageDocument) {
                        newState.resultSecondImageDocument = localState.resultSecondImageDocument;
                    }
                    newState.results += localState.results;
                }
                newState.results += '\n';
                this.setState(newState);
            }
        } catch (error) {
            console.log(error);
            this.setState({ showFirstImageDocument: false, resultFirstImageDocument: '', showSecondImageDocument: false, resultSecondImageDocument: '', results: 'Scanning has been cancelled'});
        }
    }

    handleResult(result) {
        var localState = {
            showFirstImageDocument: false,
            resultFirstImageDocument: '',
            showSecondImageDocument: false,
            resultSecondImageDocument: '',
            results: ''
        };

        if (result instanceof BlinkCardReactNative.BlinkCardRecognizerResult) {
            let blinkCardResult = result;

            let resultString =
            buildResult(blinkCardResult.cardNumber, 'Card Number') +
            buildResult(blinkCardResult.cardNumberPrefix, 'Card Number Prefix') +
            buildResult(blinkCardResult.iban, 'IBAN') +
            buildResult(blinkCardResult.cvv, 'CVV') +
            buildResult(blinkCardResult.owner, 'Owner') +
            buildResult(blinkCardResult.cardNumberValid.toString(), 'Card Number Valid') +
            buildDateResult(blinkCardResult.expiryDate, 'Expiry date') +
            buildLivenessResult(blinkCardResult.documentLivenessCheck.front, 'Front side liveness checks') +
            buildLivenessResult(blinkCardResult.documentLivenessCheck.back, 'Back side liveness checks');

            // there are other fields to extract
            localState.results += resultString;

            // Document image is returned as Base64 encoded JPEG
            if (blinkCardResult.firstSideFullDocumentImage) {
                localState.showFirstImageDocument = true;
                localState.resultFirstImageDocument = 'data:image/jpg;base64,' + blinkCardResult.firstSideFullDocumentImage;
            }
            if (blinkCardResult.secondSideFullDocumentImage) {
                localState.showSecondImageDocument = true;
                localState.resultSecondImageDocument = 'data:image/jpg;base64,' + blinkCardResult.secondSideFullDocumentImage;
            }
        }
        return localState;
    }

    render() {
        let displayFrontImageDocument = this.state.resultFirstImageDocument;
        let displayBackImageDocument = this.state.resultSecondImageDocument;
        let displayFields = this.state.results;
        return (
        <View style={styles.container}>
            <Text style={styles.label}>BlinkCard</Text>
            <View style={styles.buttonContainer}>
            <Button
                onPress={this.scan.bind(this)}
                title="Scan"
                color="#48B2E8"
            />
            </View>
            <ScrollView
            automaticallyAdjustContentInsets={false}
            scrollEventThrottle={200}y>
            <Text style={styles.results}>{displayFields}</Text>
            {renderIf(this.state.showFirstImageDocument,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: displayFrontImageDocument, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            {renderIf(this.state.showSecondImageDocument,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: displayBackImageDocument, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            </ScrollView>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  label: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 50
  },
  buttonContainer: {
    margin: 20
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  results: {
    fontSize: 16,
    textAlign: 'left',
    margin: 10,
  },
  imageResult: {
    flex: 1,
    flexShrink: 1,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
});

AppRegistry.registerComponent('Sample', () => Sample);
