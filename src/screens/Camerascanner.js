import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Image, ActivityIndicator, TouchableOpacity, ScrollView, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import textRecognition from '@react-native-ml-kit/text-recognition';

const Camerascanner = () => {
  const [scannedText, setScannedText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Camera permission is required to use this feature.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Function to open the camera and capture the image
  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelled', 'User cancelled camera');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        scanText(uri);
      } else {
        Alert.alert('Error', 'No image captured');
      }
    });
  };

  // Function to open the gallery and pick an image
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelled', 'User cancelled image selection');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        scanText(uri);
      } else {
        Alert.alert('Error', 'No image selected');
      }
    });
  };

  // Function to scan text from the image using @react-native-ml-kit/text-recognition
  const scanText = async (uri) => {
    setLoading(true);
    try {
      const result = await textRecognition.recognize(uri);
      if (result.blocks && result.blocks.length > 0) {
        const recognizedText = result.blocks.map(block => block.text).join('\n');
        setScannedText(recognizedText);
      } else {
        Alert.alert('No Text Found', 'No text recognized in the image.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to scan text from image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Scan Passport</Text>

        {/* TouchableOpacity to open camera */}
        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>

        {/* TouchableOpacity to open gallery */}
        <TouchableOpacity style={styles.button} onPress={openGallery}>
          <Text style={styles.buttonText}>Open Gallery</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#1E90FF" style={styles.loader} />}

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        {scannedText ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{scannedText}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loader: {
    marginTop: 20,
  },
  imagePreview: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultContainer: {
    padding: 10,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
});

export default Camerascanner;


