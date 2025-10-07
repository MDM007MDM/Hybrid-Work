import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import Avatar from './Avatar';

export default function StatusItem({ item, currentUser, onLike, onUnlike, onComment, submitting }) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');

  const submitComment = () => {
    if (!commentText.trim()) return;
    onComment(item, commentText.trim());
    setCommentText('');
    setShowCommentBox(false);
  };

  const likeCount = Array.isArray(item.like) ? item.like.length : (item.likeCount ?? 0);
  const author = item.createdBy?.email || 'ไม่ทราบผู้โพสต์';
  const authorImage = item.createdBy?.image;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar uri={authorImage} size={36} />
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.author}>{author}</Text>
          {/* Could render relative time here if available */}
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>ไลค์: {likeCount}</Text>
        <Text style={styles.meta}>คอมเมนต์: {item.comment?.length ?? 0}</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => (item.hasLiked ? onUnlike(item) : onLike(item))}
          style={[styles.button, item.hasLiked ? styles.btnLiked : styles.btnLike]}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{item.hasLiked ? 'Unlike' : 'Like'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowCommentBox((s) => !s)}
          style={[styles.button, styles.btnComment]}
        >
          <Text style={styles.buttonText}>Comment</Text>
        </TouchableOpacity>
      </View>
      {showCommentBox && (
        <View style={styles.commentBox}>
          <TextInput
            style={styles.input}
            placeholder="เขียนคอมเมนต์..."
            value={commentText}
            onChangeText={setCommentText}
          />
          <Button title="ส่ง" onPress={submitComment} disabled={submitting} />
        </View>
      )}
      {item.comment?.length ? (
        <View style={styles.comments}>
          {item.comment.slice(0, 3).map((c) => (
            <Text key={c._id} style={styles.commentItem}>
              • {c.createdBy?.email ? `${c.createdBy.email}: ` : ''}{c.content}
            </Text>
          ))}
          {item.comment.length > 3 && (
            <Text style={styles.more}>… ดูทั้งหมด {item.comment.length} ความคิดเห็น</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  author: { fontSize: 14, color: '#333', fontWeight: '600' },
  content: { fontSize: 16, marginVertical: 8 },
  row: { flexDirection: 'row', gap: 8 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  meta: { color: '#666' },
  button: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginRight: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  btnLike: { backgroundColor: '#1877F2' },
  btnLiked: { backgroundColor: '#6c757d' },
  btnComment: { backgroundColor: '#00A400' },
  commentBox: { marginTop: 8 },
  comments: { marginTop: 8 },
  commentItem: { color: '#333', marginTop: 4 },
  more: { color: '#1877F2', marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
});

