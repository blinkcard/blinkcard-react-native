/**
 * Sample React Native App for BlinkID
 * https://github.com/BlinkID/blinkid-react-native
 */

import React, { Component } from 'react';
import * as BlinkIDReactNative from 'blinkid-react-native';
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
    ios: 'sRwAAAEVY29tLm1pY3JvYmxpbmsuc2FtcGxl1BIcP4FpSuS/38JVOjalnIUAO6GSoXBJSnE8F0QDNJHKEMH7o9ipBUa6gs9JVUn1xhlm+gU+CE8M5dfpDJ5dThQAwhdat7lEBlhqCWhhVnaFAwhRPzmGoBT5DPJH+/j0bMsP52KFNDIQyjJ56+N/rtC1NQc0A/5weRzGQ0mJCESXhL1iCYi/ewtO8VmzBIMsPHcbtNKVqSabeqBOvjKVdwCDodUHYD4gxp+Z5QGjWEUTqqubZcRckHLEq+55y3IRpBev7y2ZfrwTPTBvkg6icvXZzpYl9G7UQnJfsx90JCFnGbFwkzgtCyG0D4EgWxpW2TRBZU9REHXXGZqh9BdHGCmv',
    // android license key for applicationID: com.microblink.sample
    android: 'sRwAAAAVY29tLm1pY3JvYmxpbmsuc2FtcGxlU9kJdZhZkGlTu9U3Oitiw6TT2FGkiyJFlAhM8pExgH/ZF5IuOoC/DbKHoiR382JaMb+r7NDBTzi88CBCEGTbXlCknk+hJObhf+9SOOJyV9scpqUqGgudxZCbR7Ao8QVhwb7XavkyHr+6j1COdVVFlV105JVZF2y7TTB/c6qKl1YLlEPsHcgQJIR15cWeLaSrM9SDq3cW66fdVqjrmXTlZOpo3r6Kzc5LWa+B/kFt7oEJGC3+E8RVD0L/BM6W0vQvCFrgz2XMss7AmHyHugG2t7xId3TBcx9Jct+EcEjICkuJ3KnzdNj8OlVIHcVAlEcLcqx90wxL'
})

const licenseKeyBlinkcard = Platform.select({
    // iOS license key for applicationID: com.microblink.sample
    ios: 'sRwAAAEVY29tLm1pY3JvYmxpbmsuc2FtcGxl1BIcP6dpSuS/37rVPjGtkIpFWh9/i3ghC0iaOPslszZPC2/82MLvU9ia31gS8k6NGgkAntvp+hm/nTwnB32EMvVObWBr/9WtHfJTce+hXWSLXeM9mlruZmqynXj1eeK/jcXOkn6ReHi9gmiHisBwA1xlPAREe7iR9Otj/atLVZ2pxY2suYkNhpVe60QwGdZf30dcM67oq5DhDSELsBj0Fd9U7uJk6AZs/Ks8KcDOjw==',
    // android license key for applicationID: com.microblink.sample
    android: 'sRwAAAAVY29tLm1pY3JvYmxpbmsuc2FtcGxlU9kJdb5ZkGlTu623Pixnw9vZ9zTZHftf1iGlXXalEYgUQdYI3vvCN6I08Ce3k40ivIYeIbScNtA1CSsZp4OZg36O6FZ3K0jRMqGXY6LNEiRPq5PGZ/y0cU63Ad8+MudnVCFDZwHM9W2CQSZAGTIPJyTjLTXdO+0aFcjPoULTXJOn4s+QugoDXLhnKYi7CqgkyDSL6KZluijeRZDaSP0qTjchmF84xfiNxPgGaJSNlQ=='
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
            showFrontImageDocument: false,
            resultFrontImageDocument: '',
            showBackImageDocument: false,
            resultBackImageDocument: '',
            showImageFace: false,
            resultImageFace: '',
            showSuccessFrame: false,
            successFrame: '',
            results: '',
            licenseKeyErrorMessage: ''
        };
    }

    async scan() {
        try {

            // to scan any machine readable travel document (passports, visas and IDs with
            // machine readable zone), use MrtdRecognizer
            // var mrtdRecognizer = new BlinkIDReactNative.MrtdRecognizer();
            // mrtdRecognizer.returnFullDocumentImage = true;

            // var mrtdSuccessFrameGrabber = new BlinkIDReactNative.SuccessFrameGrabberRecognizer(mrtdRecognizer);

            // BlinkIDCombinedRecognizer automatically classifies different document types and scans the data from
            // the supported document
            var blinkIdCombinedRecognizer = new BlinkIDReactNative.BlinkIdCombinedRecognizer();
            blinkIdCombinedRecognizer.returnFullDocumentImage = true;
            blinkIdCombinedRecognizer.returnFaceImage = true;

            const scanningResults = await BlinkIDReactNative.BlinkID.scanWithCamera(
                new BlinkIDReactNative.BlinkIdOverlaySettings(),
                new BlinkIDReactNative.RecognizerCollection([blinkIdCombinedRecognizer/*, mrtdSuccessFrameGrabber*/]),
                licenseKey
            );

            if (scanningResults) {
                let newState = {
                    showFrontImageDocument: false,
                    resultFrontImageDocument: '',
                    showBackImageDocument: false,
                    resultBackImageDocument: '',
                    showImageFace: false,
                    resultImageFace: '',
                    results: '',
                    showSuccessFrame: false,
                    successFrame: ''
                };

                for (let i = 0; i < scanningResults.length; ++i) {
                    let localState = this.handleResult(scanningResults[i]);
                    newState.showFrontImageDocument = newState.showFrontImageDocument || localState.showFrontImageDocument;
                    if (localState.showFrontImageDocument) {
                        newState.resultFrontImageDocument = localState.resultFrontImageDocument;
                    }
                    newState.showBackImageDocument = newState.showBackImageDocument || localState.showBackImageDocument;
                    if (localState.showBackImageDocument) {
                        newState.resultBackImageDocument = localState.resultBackImageDocument;
                    }
                    newState.showImageFace = newState.showImageFace || localState.showImageFace;
                    if (localState.resultImageFace) {
                        newState.resultImageFace = localState.resultImageFace;
                    }
                    newState.results += localState.results;
                    newState.showSuccessFrame = newState.showSuccessFrame || localState.showSuccessFrame;
                    if (localState.successFrame) {
                        newState.successFrame = localState.successFrame;
                    }

                }
                newState.results += '\n';
                this.setState(newState);
            }
        } catch (error) {
            console.log(error);
            this.setState({ showFrontImageDocument: false, resultFrontImageDocument: '', showBackImageDocument: false, resultBackImageDocument: '', showImageFace: false, resultImageFace: '', results: 'Scanning has been cancelled', showSuccessFrame: false,
            successFrame: ''});
        }
    }


    async scanBlinkCard() {
        try {
            var blinkCardRecognizer = new BlinkCardReactNative.BlinkCardRecognizer();
            blinkCardRecognizer.returnFullDocumentImage = true;

            const scanningResults = await BlinkCardReactNative.BlinkCard.scanWithCamera(
                new BlinkCardReactNative.BlinkCardOverlaySettings(),
                new BlinkCardReactNative.RecognizerCollection([blinkCardRecognizer]),
                licenseKeyBlinkcard
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
                    let localState = this.handleResultBlinkcard(scanningResults[i]);
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

    handleResultBlinkcard(result) {
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

    handleResult(result) {
        var localState = {
            showFrontImageDocument: false,
            resultFrontImageDocument: '',
            showBackImageDocument: false,
            resultBackImageDocument: '',
            resultImageFace: '',
            results: '',
            showSuccessFrame: false,
            successFrame: ''
        };

        if (result instanceof BlinkIDReactNative.BlinkIdCombinedRecognizerResult) {
            let blinkIdResult = result;

            let resultString =
                buildResult(blinkIdResult.firstName, "First name") +
                buildResult(blinkIdResult.lastName, "Last name") +
                buildResult(blinkIdResult.fullName, "Full name") +
                buildResult(blinkIdResult.localizedName, "Localized name") +
                buildResult(blinkIdResult.additionalNameInformation, "Additional name info") +
                buildResult(blinkIdResult.address, "Address") +
                buildResult(blinkIdResult.additionalAddressInformation, "Additional address info") +
                buildResult(blinkIdResult.documentNumber, "Document number") +
                buildResult(blinkIdResult.documentAdditionalNumber, "Additional document number") +
                buildResult(blinkIdResult.sex, "Sex") +
                buildResult(blinkIdResult.issuingAuthority, "Issuing authority") +
                buildResult(blinkIdResult.nationality, "Nationality") +
                buildDateResult(blinkIdResult.dateOfBirth, "Date of birth") +
                buildResult(blinkIdResult.age, "Age") +
                buildDateResult(blinkIdResult.dateOfIssue, "Date of issue") +
                buildDateResult(blinkIdResult.dateOfExpiry, "Date of expiry") +
                buildResult(blinkIdResult.dateOfExpiryPermanent, "Date of expiry permanent") +
                buildResult(blinkIdResult.expired, "Expired") +
                buildResult(blinkIdResult.maritalStatus, "Martial status") +
                buildResult(blinkIdResult.personalIdNumber, "Personal id number") +
                buildResult(blinkIdResult.profession, "Profession") +
                buildResult(blinkIdResult.race, "Race") +
                buildResult(blinkIdResult.religion, "Religion") +
                buildResult(blinkIdResult.residentialStatus, "Residential status") +
                buildResult(blinkIdResult.processingStatus, "Processing status") +
                buildResult(blinkIdResult.recognitionMode, "Recognition mode")
                ;

            let licenceInfo = blinkIdResult.driverLicenseDetailedInfo;
            if (licenceInfo) {
                resultString +=
                    buildResult(licenceInfo.restrictions, "Restrictions") +
                    buildResult(licenceInfo.endorsements, "Endorsements") +
                    buildResult(licenceInfo.vehicleClass, "Vehicle class") +
                    buildResult(licenceInfo.conditions, "Conditions");
            }

            // there are other fields to extract
            localState.results += resultString;

            // Document image is returned as Base64 encoded JPEG
            if (blinkIdResult.fullDocumentFrontImage) {
                localState.showFrontImageDocument = true;
                localState.resultFrontImageDocument = 'data:image/jpg;base64,' + blinkIdResult.fullDocumentFrontImage;
            }
            if (blinkIdResult.fullDocumentBackImage) {
                localState.showBackImageDocument = true;
                localState.resultBackImageDocument = 'data:image/jpg;base64,' + blinkIdResult.fullDocumentBackImage;
            }
            // Face image is returned as Base64 encoded JPEG
            if (blinkIdResult.faceImage) {
                localState.showImageFace = true;
                localState.resultImageFace = 'data:image/jpg;base64,' + blinkIdResult.faceImage;
            }
        }
        return localState;
    }

    render() {
        let displayFrontImageDocument = this.state.resultFrontImageDocument;
        let displayBackImageDocument = this.state.resultBackImageDocument;
        let displayImageFace = this.state.resultImageFace;
        let displaySuccessFrame = this.state.successFrame;
        let displayFields = this.state.results;

                let bcdisplayFrontImageDocument = this.state.resultFirstImageDocument;
        let bcdisplayBackImageDocument = this.state.resultSecondImageDocument;
        let bcdisplayFields = this.state.results;

        return (
                    <ScrollView>
                    <View style={styles.container}>
            <Text style={styles.label}>BlinkCard</Text>
            <View style={styles.buttonContainer}>
            <Button
                onPress={this.scanBlinkCard.bind(this)}
                title="Scan Blinkcard"
                color="#48B2E8"
            />
            </View>
            <ScrollView
            automaticallyAdjustContentInsets={false}
            scrollEventThrottle={200}y>
            <Text style={styles.results}>{bcdisplayFields}</Text>
            {renderIf(this.state.showFirstImageDocument,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: bcdisplayFrontImageDocument, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            {renderIf(this.state.showSecondImageDocument,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: bcdisplayBackImageDocument, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            </ScrollView>
            </View>

        <View style={styles.container}>
            <Text style={styles.label}>BlinkID</Text>
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
            {renderIf(this.state.showFrontImageDocument,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: displayFrontImageDocument, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            {renderIf(this.state.showBackImageDocument,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: displayBackImageDocument, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            {renderIf(this.state.showImageFace,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: displayImageFace, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            {renderIf(this.state.showSuccessFrame,
                <View style={styles.imageContainer}>
                    <Image
                    resizeMode='contain'
                    source={{uri: displaySuccessFrame, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            </ScrollView>
        </View>
        </ScrollView>
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
