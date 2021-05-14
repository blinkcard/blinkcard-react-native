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
    ios: 'sRwAAAEVY29tLm1pY3JvYmxpbmsuc2FtcGxl1BIcP6dpSuS/37rVPcGKMeTrsgR8MahcSwwXAx7W+q4DISNxpyD6+I7UJwEXZY0idcmSKWVeQM6vHpTFfH7GFprdWTFfjlKyu60UtOHF0npdL2MmfTLta+7nnJRT28SshWOzbKsFOlZ0JJoeiZMEyM4znE2J6KFWNTsI8rIUfKoZvf1ZrPQRT1B+2AzIVrm6WmIIUKHsoHnmvNM424vPEBC4yhcWu2anECMkX8Li/Q==',
    // android license key for applicationID: com.microblink.sample
    android: 'sRwAAAAVY29tLm1pY3JvYmxpbmsuc2FtcGxlU9kJdb5ZkGlTu623OTxHZKAmHTzXqVNPuhHHnXm497TWowJa0vswsDtOQZq7Sc8lndoPORaoDMYFMvzd4/aLTADiHm1Tg3+sCO9AS5lKKIrKANkKNEDvlHwYct9+g5e3xyq6fVy+uMzsdkFZqqbpCChDILiBQOJF4NOTufTLEDSeVNNV10nLisEBYEzD4zWZ9vnBZRNvg7WeEHOUoAOkn521e3E/oK9Andekqi0zbg=='
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
            buildDateResult(blinkCardResult.expiryDate, 'Expiry date');

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
