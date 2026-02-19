import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomHeader from '../components/CustomHeader';

const UserReviewScreen = () => {
  const [review, setReview] = useState('');
  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
    });
    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const uploadReview = () => {
    if (!review) {
      Alert.alert('Error', 'Please enter a review');
      return;
    }
    setUploading(true);
    setProgress(0);

    // mock upload api
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          Alert.alert('Success', 'Review uploaded successfully!');
          setReview('');
          setImage(null);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Add Review" showBack />
      <View style={styles.container}>
        <Text style={styles.label}>Write your review:</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          value={review}
          onChangeText={setReview}
          placeholder="Write your review here..."
        />

        <Button title="Select Image (Optional)" onPress={selectImage} />
        {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

        <View style={styles.spacer} />

        {uploading ? (
          <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.progress}>Uploading... {progress}%</Text>
          </View>
        ) : (
          <Button title="Submit Review" onPress={uploadReview} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  preview: { width: 100, height: 100, marginTop: 10, borderRadius: 5 },
  spacer: { height: 20 },
  progress: { textAlign: 'center', marginTop: 10 },
});

export default UserReviewScreen;
