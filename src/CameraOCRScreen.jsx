import React, {useState, useEffect} from 'react';
import {View, Text, Button, Image, StyleSheet} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import TesseractOcr from 'react-native-tesseract-ocr';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const CameraOCRScreen = () => {
  const [imagePath, setImagePath] = useState(null); // Image path store karna
  const [recognizedText, setRecognizedText] = useState(''); // Recognized text store karna
  const [hasPermission, setHasPermission] = useState(false); // Permission check karna

  // Camera permission request karna
  useEffect(() => {
    const requestCameraPermission = async () => {
      const cameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
      if (cameraStatus === RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    };
    requestCameraPermission();
  }, []);

  // OCR function jo image se text recognize karega
  const recognizeText = uri => {
    TesseractOcr.recognize(uri, 'eng', {
      whitelist: null, // Optional: specific characters ko allow karne ke liye
      blacklist: null, // Optional: specific characters ko ignore karne ke liye
    })
      .then(result => {
        setRecognizedText(result); // Recognized text ko store karna
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Camera se photo lena
  const takePhoto = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (response.assets) {
        setImagePath(response.assets[0].uri); // Image ko display karna
        recognizeText(response.assets[0].uri); // Image se text recognize karna
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Take Photo" onPress={takePhoto} />{' '}
      {/* Camera se photo lene ke liye button */}
      {imagePath && (
        <View style={styles.imageContainer}>
          <Image source={{uri: imagePath}} style={styles.image} />{' '}
          {/* Image display karna */}
        </View>
      )}
      {recognizedText ? (
        <Text style={styles.text}>{recognizedText}</Text> // Recognized text ko display karna
      ) : (
        <Text>No text recognized yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  text: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#f9f9f9',
  },
});

export default CameraOCRScreen;
