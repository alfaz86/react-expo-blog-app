import React from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";

const ArticleComment = ({ comment }) => {
  const { width } = useWindowDimensions();

  // Fungsi rekursif untuk menampilkan komentar dan subkomentar
  const renderComments = (comments) => {
    return comments.map((comment) => (
      <View key={comment.id_code} style={styles.comment}>
        <Image
          source={{ uri: comment.user.profile_image }}
          style={styles.commentImage}
        />
        <View style={styles.commentContent}>
          <Text style={styles.commentAuthor}>{comment.user.name}</Text>
          <RenderHTML contentWidth={width - 70} source={{ html: comment.body_html }} />

          {/* Menampilkan children (subkomentar) secara rekursif jika ada */}
          {comment.children && comment.children.length > 0 && (
            <View style={styles.childrenContainer}>
              {renderComments(comment.children)}
            </View>
          )}
        </View>
      </View>
    ));
  };

  return <>{renderComments([comment])}</>;
};

const styles = StyleSheet.create({
  comment: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  commentImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
    paddingTop: 5,
  },
  childrenContainer: {
    paddingTop: 5,
  },
});

export default ArticleComment;
