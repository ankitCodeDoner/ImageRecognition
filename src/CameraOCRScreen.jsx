import React, {useState, useEffect} from 'react';
import {View, Text, Button, Image, StyleSheet} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import TesseractOcr from 'react-native-tesseract-ocr';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const CameraOCRScreen = () => {
  const [imagePath, setImagePath] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  // Camera permission request karna
  useEffect(() => {
    const requestCameraPermission = async () => {
      const cameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
      setHasPermission(cameraStatus === RESULTS.GRANTED);
    };
    requestCameraPermission();
  }, []);

  // OCR function jo image se text recognize karega
  const recognizeText = uri => {
    TesseractOcr.recognize(uri, 'eng', {
      whitelist: null,
      blacklist: null,
    })
      .then(result => {
        setRecognizedText(result);
      })
      .catch(err => {
        console.log('OCR Error:', err);
      });
  };

  // Camera se photo lena
  const takePhoto = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImagePath(uri);
        recognizeText(uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Take Photo" onPress={takePhoto} />
      {/* Camera se photo lene ke liye button */}

      {imagePath && (
        <View style={styles.imageContainer}>
          <Image source={{uri: imagePath}} style={styles.image} />
          {/* Image display karna */}
        </View>
      )}

      <Text style={styles.text}>
        {recognizedText ? recognizedText : 'No text recognized yet'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  text: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
});

export default CameraOCRScreen;
