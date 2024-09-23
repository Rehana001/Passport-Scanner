
// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, Alert, Image, ActivityIndicator, TouchableOpacity, ScrollView, PermissionsAndroid } from 'react-native';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import textRecognition from '@react-native-ml-kit/text-recognition';

// const Camerascanner = () => {
//   const [scannedText, setScannedText] = useState('');
//   const [imageUri, setImageUri] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     requestCameraPermission();
//   }, []);

//   const requestCameraPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         {
//           title: 'Camera Permission',
//           message: 'This app needs access to your camera.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         Alert.alert('Permission Denied', 'Camera permission is required to use this feature.');
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

//   const openCamera = () => {
//     const options = {
//       mediaType: 'photo',
//       saveToPhotos: false,
//     };

//     launchCamera(options, (response) => {
//       if (response.didCancel) {
//         Alert.alert('Cancelled', 'User cancelled camera');
//       } else if (response.errorMessage) {
//         Alert.alert('Error', response.errorMessage);
//       } else if (response.assets && response.assets.length > 0) {
//         const uri = response.assets[0].uri;
//         setImageUri(uri);
//         scanText(uri);
//       } else {
//         Alert.alert('Error', 'No image captured');
//       }
//     });
//   };

//   const openGallery = () => {
//     const options = {
//       mediaType: 'photo',
//     };

//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) {
//         Alert.alert('Cancelled', 'User cancelled image selection');
//       } else if (response.errorMessage) {
//         Alert.alert('Error', response.errorMessage);
//       } else if (response.assets && response.assets.length > 0) {
//         const uri = response.assets[0].uri;
//         setImageUri(uri);
//         scanText(uri);
//       } else {
//         Alert.alert('Error', 'No image selected');
//       }
//     });
//   };

//   const scanText = async (uri) => {
//     setLoading(true);
//     try {
//       const result = await textRecognition.recognize(uri);
//       const blocks = result.blocks;
//       console.log('Detected text blocks:', blocks);

//       if (blocks && blocks.length > 0) {
//         // Filter for card-like text patterns
//         const cardText = blocks
//           .filter(block => isCardText(block.text))
//           .map(block => block.text)
//           .join('\n');

//         if (cardText) {
//           setScannedText(cardText);
//         } else {
//           Alert.alert('No Card Found', 'No valid card details detected.');
//         }
//       } else {
//         Alert.alert('No Text Found', 'No text recognized in the image.');
//       }
//     } catch (error) {
//       Alert.alert('Error', `Failed to scan text from image: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isCardText = (text) => {
//     // Regex pattern for credit card numbers (format: 1234-5678-9012-3456 or 1234567890123456)
//     const cardNumberPattern = /(?:\b\d{4}[- ]?){3}\d{4}\b/; // e.g., 1234 5678 9012 3456
//     // Regex pattern for names (assuming names typically include capital letters and spaces)
//     const namePattern = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/; // e.g., John Doe

//     // Ensure the text only contains card number or valid name format
//     return cardNumberPattern.test(text) || namePattern.test(text);
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <Text style={styles.title}>Scan Card</Text>

//         <TouchableOpacity style={styles.button} onPress={openCamera}>
//           <Text style={styles.buttonText}>Open Camera</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.button} onPress={openGallery}>
//           <Text style={styles.buttonText}>Open Gallery</Text>
//         </TouchableOpacity>

//         {loading && <ActivityIndicator size="large" color="#1E90FF" style={styles.loader} />}

//         {imageUri && (
//           <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//         )}

//         {scannedText ? (
//           <View style={styles.resultContainer}>
//             <Text style={styles.resultText}>Recognized Card Text:</Text>
//             <Text style={styles.scannedText}>{scannedText}</Text>
//           </View>
//         ) : null}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   button: {
//     backgroundColor: '#1E90FF',
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 5,
//     marginVertical: 10,
//     width: '100%',
//     alignItems: 'center',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   loader: {
//     marginTop: 20,
//   },
//   imagePreview: {
//     width: 300,
//     height: 300,
//     marginTop: 20,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   resultContainer: {
//     padding: 10,
//     marginTop: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   resultText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//     textAlign: 'center',
//   },
//   scannedText: {
//     fontSize: 16,
//     color: '#000',
//     textAlign: 'center',
//   },
// });

// export default Camerascanner;

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

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: false,
    };

    // Clear previous image and text before starting scan
    setScannedText('');
    setImageUri(null);
    setLoading(true);

    launchCamera(options, (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelled', 'User cancelled camera');
        setLoading(false);
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        setLoading(false);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        scanText(uri);
      } else {
        Alert.alert('Error', 'No image captured');
        setLoading(false);
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
    };

    // Clear previous image and text before starting scan
    setScannedText('');
    setImageUri(null);
    setLoading(true);

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelled', 'User cancelled image selection');
        setLoading(false);
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        setLoading(false);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        scanText(uri);
      } else {
        Alert.alert('Error', 'No image selected');
        setLoading(false);
      }
    });
  };

  const scanText = async (uri) => {
    try {
      const result = await textRecognition.recognize(uri);
      const blocks = result.blocks;
      console.log('Detected text blocks:', blocks);

      if (blocks && blocks.length > 0) {
        // Filter for card-like text patterns
        const cardText = blocks
          .filter(block => isCardText(block.text))
          .map(block => block.text)
          .join('\n');

        if (cardText) {
          setScannedText(cardText); // Display the scanned text
        } else {
          Alert.alert('No Card Found', 'No valid card details detected.');
        }
      } else {
        Alert.alert('No Text Found', 'No text recognized in the image.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to scan text from image: ${error.message}`);
    } finally {
      setLoading(false); // Stop loading when scanning is complete
    }
  };

  const isCardText = (text) => {
    // Regex pattern for credit card numbers (format: 1234-5678-9012-3456 or 1234567890123456)
    const cardNumberPattern = /(?:\b\d{4}[- ]?){3}\d{4}\b/; // e.g., 1234 5678 9012 3456
    // Regex pattern for names (assuming names typically include capital letters and spaces)
    const namePattern = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/; // e.g., John Doe

    // Ensure the text only contains card number or valid name format
    return cardNumberPattern.test(text) || namePattern.test(text);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Scan Card</Text>

        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openGallery}>
          <Text style={styles.buttonText}>Open Gallery</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#1E90FF" style={styles.loader} />}

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        {!loading && scannedText ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Recognized Card Text:</Text>
            <Text style={styles.scannedText}>{scannedText}</Text>
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
    elevation: 3,
    shadowColor: '#000',
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
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  scannedText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});

export default Camerascanner;
