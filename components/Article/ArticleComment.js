import React from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";

const ArticleComment = ({ comment }) => {
  const { width } = useWindowDimensions();

  return (
    <View key={comment.id_code} style={styles.comment}>
      <Image
        source={{ uri: comment.user.profile_image_90 }}
        style={styles.commentImage}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{comment.user.name}</Text>
        <RenderHTML contentWidth={width - 70} source={{ html: comment.body_html }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
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
});

export default ArticleComment;
