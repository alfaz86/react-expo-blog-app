import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { createArticle } from '@/utils/api';
import TextEditor from '@/components/Dom/TextEditor';
import { base64ToBlob } from '@/utils/helper';

const IS_DOM = typeof TextEditor !== "undefined";

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [editorState, setEditorState] = useState(null);
  const [plainText, setPlainText] = useState("");

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const maxSize = 5 * 1024 * 1024;

      if (Platform.OS !== 'web') {
        const fileInfo = await FileSystem.getInfoAsync(uri);

        if (fileInfo.size <= maxSize) {
          setImage(result.assets[0]);
        } else {
          Alert.alert('Error', 'File size exceeds 5MB. Please select a smaller image.');
        }
      } else {
        const fileSize = uri.split(',')[1].length * (3 / 4);

        if (fileSize <= maxSize) {
          setImage(result.assets[0]);
        } else {
          window.alert('Error: File size exceeds 5MB. Please select a smaller image.');
        }
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setBodyHtml('');
    setTags('');
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!title || !description || !bodyHtml || !tags || !image) {
      if (Platform.OS !== 'web') {
        Alert.alert('Validation Error', 'All fields are required!');
        return;
      } else {
        window.alert('Validation Error: All fields are required!');
        return;
      }
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('body_html', bodyHtml);
    formData.append('tags', JSON.stringify(tags.split(',')));

    if (image) {
      const filename = image.uri.split('/').pop();
      const match = /\.(jpg|jpeg|png)$/i.exec(filename);

      // Check if match is found
      const fileExtension = match ? match[1] : 'jpg';  // Default to 'jpg' if no extension is found
      const mimeType = `image/${fileExtension}`;

      if (Platform.OS !== 'web') {
        // For Android/iOS: Use file URI for the image
        formData.append('cover_image', {
          uri: image.uri,
          name: filename,
          type: mimeType,
        });
      } else {
        // For Web: Convert base64 to a Blob (or File) object
        const base64String = image.uri.split(',')[1];
        if (base64String) {
          const blob = base64ToBlob(image.uri, mimeType);

          // Ensure filename includes the extension for web
          const fileWithExtension = filename.endsWith(`.${fileExtension}`)
            ? filename
            : `${filename}.${fileExtension}`;

          formData.append('cover_image', blob, fileWithExtension);
        } else {
          window.alert('Invalid base64 string!');
          return;
        }
      }
    }

    setLoading(true);

    try {
      const response = await createArticle(formData);

      if (response) {
        Alert.alert('Article created successfully!');
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        Alert.alert('Failed to create article.');
      }
    } catch (error) {
      console.error('Error creating article:', error);
      Alert.alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const buildView = () => {
    return (
      <>
        {/* <TextEditor setPlainText={setPlainText} setEditorState={setEditorState} setBodyHtml={setBodyHtml} /> */}
      </>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>

          <Text style={styles.header}>Create Article</Text>

          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.image} />
            </View>
          )}

          <View style={styles.buttonSelectImage}>
            <Button title="Select Thumbnail" onPress={selectImage} />
          </View>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <TextInput
            placeholder="Body HTML"
            value={bodyHtml}
            onChangeText={setBodyHtml}
            style={styles.input}
          />

          {/* {buildView()} */}

          <TextInput
            placeholder="Tags (comma separated)"
            value={tags}
            onChangeText={setTags}
            style={styles.input}
          />

          <View style={styles.buttonSubmit}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button
                title="Submit Article"
                onPress={handleSubmit}
                disabled={loading}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  formContainer: {
    padding: 20,
  },
  buttonSelectImage: {
    marginBottom: 10,
    paddingBottom: 10,
  },
});

export default CreateArticle;
