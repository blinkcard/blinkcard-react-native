/**
 * Sample React Native App for BlinkCard
 * https://github.com/BlinkCard/blinkcard-react-native
 */

import React, { Component } from 'react';
import * as BlinkCardReactNative from '@microblink/blinkcard-react-native';
import * as ImagePicker from 'react-native-image-picker';

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
    ios: 'sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUBbGV5SkRjbVZoZEdWa1QyNGlPakUzTlRFMU5ERXpORFk1TWpjc0lrTnlaV0YwWldSR2IzSWlPaUprWkdRd05qWmxaaTAxT0RJekxUUXdNRGd0T1RRNE1DMDFORFU0WWpBeFlUVTJZamdpZlE9PTq74d7HAcUKlohgXiu/wccsKLl2cqELCmZkuUvDhefRlCY0scVq70z3J0Uvha1H4AUBzcDG+pc+eSwp5Is1Ik/R0Dur39LzgumUB59v5ognxT8Lq0qLWqePF2DoGg==',
    // android license key for applicationID: com.microblink.sample
    android: 'sRwCABVjb20ubWljcm9ibGluay5zYW1wbGUAbGV5SkRjbVZoZEdWa1QyNGlPakUzTlRFMU5ERXpPRGN5TVRjc0lrTnlaV0YwWldSR2IzSWlPaUprWkdRd05qWmxaaTAxT0RJekxUUXdNRGd0T1RRNE1DMDFORFU0WWpBeFlUVTJZamdpZlE9PUmqAgyL6GeI/BwYSwBebba3EJYNOHriDvnMLJ7ii+WRpcXhDfSp3bGJNPOm7mvs8q9OTbhfTvDXkKOdzBz+znguWy3kamfJ8+NpzBynCZHLnS4xP/umEYAh4nuaiw=='
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

    /* BlinkCard scanning with the camera */
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
            this.setState({ showFirstImageDocument: false, resultFirstImageDocument: '', showSecondImageDocument: false, resultSecondImageDocument: '', results: 'Scanning has been cancelled'});
        }
    }

    /* BlinkCard scanning with DirectAPI that requires both card images.
    Best used for getting the information from both front and backside information from various cards */
    async directApiTwoSides() {
        try {
            // Get the side of the card where the card number is located and return it in the Base64 format
            let frontImage = await this.pickImage();
            // Get the other side of the card and return it in the Base64 format
            let backImage = await this.pickImage();
            
            var blinkCardRecognizer = new BlinkCardReactNative.BlinkCardRecognizer();
            blinkCardRecognizer.returnFullDocumentImage = true;

            // Pass the recogizer along with the license and the Base64 images to the DirectAPI method of processing
            // If all of the information on the card is present on one side of the card, the image can be passed in the 'frontImage' parameter
            // and 'backImage' parameter can be passed as null or empty string ""
            const scanningResults = await BlinkCardReactNative.BlinkCard.scanWithDirectApi(
                new BlinkCardReactNative.RecognizerCollection([blinkCardRecognizer]),
                frontImage,
                backImage,
                licenseKey
            );
    
            if (scanningResults) {
                if (scanningResults.length == 0) {
                    this.setState({
                        showFirstImageDocument: false,
                        resultFrontImageDocument: '',
                        showBackImageDocument: false,
                        resultBackImageDocument: '',
                        results: 'Could not extract the information from the images!'
                    })
                } else {
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
            }
        } catch (error) {
            this.setState({ showFirstImageDocument: false, resultFirstImageDocument: '', showSecondImageDocument: false, resultSecondImageDocument: '', results: error.toString()});
        }
    }

    /* BlinkCard scanning with DirectAPI that requires one card image.
    Best used for cards that have all of the information on one side, or if the needed information is on one side */
    async directApiOneSide() {
        try {
            // Get the side of the card where the card number is located and return it in the Base64 format
            let image = await this.pickImage();
            
            var blinkCardRecognizer = new BlinkCardReactNative.BlinkCardRecognizer();
            blinkCardRecognizer.returnFullDocumentImage = true;
            blinkCardRecognizer.extractCvv = false;
            blinkCardRecognizer.extractIban = false;
            blinkCardRecognizer.extractExpiryDate = false;

            // Pass the recogizer along with the license and the Base64 image to the DirectAPI method of processing
            const scanningResults = await BlinkCardReactNative.BlinkCard.scanWithDirectApi(
                new BlinkCardReactNative.RecognizerCollection([blinkCardRecognizer]),
                image,
                null,
                licenseKey
            );
    
            if (scanningResults) {
                if (scanningResults.length == 0) {
                    this.setState({
                        showFirstImageDocument: false,
                        resultFrontImageDocument: '',
                        showBackImageDocument: false,
                        resultBackImageDocument: '',
                        results: 'Could not extract the information from the image!'
                    })
                } else {
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
            }
        } catch (error) {
            this.setState({ showFirstImageDocument: false, resultFirstImageDocument: '', showSecondImageDocument: false, resultSecondImageDocument: '', results: error.toString()});
        }
    }

    /* A helper method for handling the picked card image */
    async pickImage() {
        return new Promise((resolve, reject) => {
            ImagePicker.launchImageLibrary({
                mediaType: 'photo',
                includeBase64: true,
            }, response => {
                if (response.didCancel) {
                    reject('Image selection canceled');
                } else if (response.error) {
                    reject(response.error);
                } else {
                    if (response.assets && response.assets.length > 0) {
                        const base64Data = response.assets[0].base64;
                        if (base64Data) {
                            resolve(base64Data);
                        } else {
                            reject('Base64 data not found in response');
                        }
                    } else {
                        reject('No assets found in response');
                    }
                }
            });
        });
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
                title="Scan with camera"
                color="#48B2E8"
            />
            <Button
                onPress={this.directApiTwoSides.bind(this)} 
                title="DirectAPI two side scanning"
                color="#48B2E8"
            />
            <Button
                onPress={this.directApiOneSide.bind(this)} 
                title="DirectAPI one side scanning"
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
      backgroundColor: 'white'
    },
    label: {
      fontSize: 30,
      textAlign: 'center',
      marginTop: 50,
      color: "black"
    },
    buttonContainer: {
      margin: 20,
      marginTop: 20,
      marginBottom: 20,
      marginTop: 20,
      gap: 20,
    },
    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'center'
    },
    results: {
      fontSize: 16,
      textAlign: 'left',
      margin: 10,
      color: 'black'
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