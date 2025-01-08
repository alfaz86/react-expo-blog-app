import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Image,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchDetailArticle, fetchArticleComments } from '@/utils/api'; // Tambahkan postComment
import RenderHTML from 'react-native-render-html';
import ArticleComment from '@/components/Article/ArticleComment';

const DetailArticle = () => {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true); // State untuk loading komentar
  const [newComment, setNewComment] = useState(''); // State untuk komentar baru
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk status submit

  useEffect(() => {
    if (!id) return;

    fetchDetailArticle(id)
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

    setLoadingComments(true); // Set loading comments sebelum fetch
    fetchArticleComments(id)
      .then((data) => {
        setComments(data);
        setLoadingComments(false);
      })
      .catch((error) => {
        console.error(error);
        setLoadingComments(false);
      });
  }, [id]);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      Alert.alert('Validation', 'Comment cannot be empty.');
      return;
    }

    setIsSubmitting(true);

    // post comment

    // alert the comment feature is not implemented yet
    Alert.alert('Comment', 'Comment feature is not implemented yet.');
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.container}>
        <Text>No article found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {article.cover_image && (
          <Image
            source={{ uri: article.cover_image }}
            style={styles.coverImage}
          />
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.author}>{article.user.name}</Text>
          <Text style={styles.date}>Published on {article.created_at}</Text>
          <RenderHTML
            contentWidth={width}
            source={{ html: article.body_html }}
            tagsStyles={{
              pre: {
                backgroundColor: '#2d2d2d',
                padding: 10,
                borderRadius: 5,
                marginBottom: 15,
                overflow: 'auto',
              },
              code: {
                color: '#f5f5f5',
                fontFamily: 'monospace',
                fontSize: 14,
                whiteSpace: 'pre-wrap',
              },
            }}
            renderersProps={{
              img: {
                resizeMode: 'cover',
                style: {
                  width: '100%',
                  marginBottom: 10,
                },
                enableExperimentalPercentWidth: true,
              },
            }}
          />
        </View>

        <View style={styles.containerComment}>
          <Text style={styles.titleComment}>Comments</Text>
          {/* Input Komentar */}
          <TextInput
            style={styles.commentInput}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment..."
            multiline
          />
          <Button
            title={isSubmitting ? 'Posting...' : 'Post Comment'}
            onPress={handleCommentSubmit}
            disabled={isSubmitting}
          />

          {/* Loading Comments */}
          {loadingComments ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            comments &&
            comments.map((comment) => (
              <ArticleComment key={comment.id} comment={comment} />
            ))
          )}
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
  content: {
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  author: {
    fontSize: 16,
    color: '#555',
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  titleComment: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  containerComment: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 10,
    paddingTop: 10,
  },
});

export default DetailArticle;
