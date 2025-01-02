import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const ArticleCard = ({ article }) => {
  const router = useRouter();

  const handleReadMore = () => {
    router.push(`/article/${article.id}`);
  };

  return (
    <View style={styles.card}>
      {article.cover_image && (
        <Image
          source={{ uri: article.cover_image }}
          style={styles.coverImage}
          resizeMode='cover'
        />
      )}
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.excerpt}>{article.description}</Text>
      <TouchableOpacity style={styles.readMoreButton} onPress={handleReadMore}>
        <Text style={styles.readMoreText}>Read More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
  },
  coverImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  excerpt: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  readMoreText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ArticleCard;
