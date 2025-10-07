import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { StatusAPI } from '../api/client';
import StatusItem from '../components/StatusItem';
import StatusComposer from '../components/StatusComposer';

export default function FeedScreen({ token, user }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [postText, setPostText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const meId = user?._id;

  const normalize = useCallback((s) => {
    const likeArr = Array.isArray(s.like) ? s.like : [];
    const hasLiked = meId ? likeArr.some((u) => u?._id === meId) : false;
    return {
      likeCount: likeArr.length,
      hasLiked,
      comment: Array.isArray(s.comment) ? s.comment : [],
      ...s,
    };
  }, [meId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await StatusAPI.list(token);
      const data = res?.data || [];
      const list = data.map((s) => normalize(s));
      setStatuses(list);
    } catch (e) {
      Alert.alert('โหลดฟีดไม่สำเร็จ', e.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [token, normalize]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const submitPost = async () => {
    if (!postText.trim()) return;
    setSubmitting(true);
    try {
      const res = await StatusAPI.create(token, { content: postText.trim() });
      const newStatus = res?.data;
      if (newStatus) {
        setStatuses((prev) => [normalize(newStatus), ...prev]);
        setPostText('');
      }
    } catch (e) {
      Alert.alert('โพสต์ไม่สำเร็จ', e.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (status) => {
    const id = status._id;
    if (!id) return;
    // Optimistic toggle like
    setStatuses((prev) => prev.map((s) => {
      if (s._id !== id) return s;
      const likeArr = Array.isArray(s.like) ? [...s.like] : [];
      const meId = user?._id;
      const hasMe = meId ? likeArr.some((u) => u?._id === meId) : s.hasLiked;
      let nextLike;
      if (hasMe) {
        nextLike = likeArr.filter((u) => u?._id !== meId);
      } else {
        nextLike = [...likeArr, { _id: meId, email: user?.email, image: user?.image }];
      }
      return { ...s, like: nextLike, likeCount: nextLike.length, hasLiked: !hasMe };
    }));

    try {
      if (status.hasLiked) {
        await StatusAPI.unlike(token, id);
      } else {
        await StatusAPI.like(token, id);
      }
    } catch (e) {
      // revert on failure
      setStatuses((prev) => prev.map((s) => {
        if (s._id !== id) return s;
        return { ...s, like: status.like, likeCount: Array.isArray(status.like) ? status.like.length : (status.likeCount ?? 0), hasLiked: status.hasLiked };
      }));
      Alert.alert('เปลี่ยนสถานะไลค์ไม่สำเร็จ', e.message || 'เกิดข้อผิดพลาด');
    }
  };

  const addComment = async (status, content) => {
    const id = status._id;
    if (!id) return;
    setSubmitting(true);
    try {
      const res = await StatusAPI.addComment(token, { statusId: id, content });
      const updated = res?.data || status;
      applyStatusUpdate(updated);
    } catch (e) {
      Alert.alert('คอมเมนต์ไม่สำเร็จ', e.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSubmitting(false);
    }
  };

  const applyStatusUpdate = (updated) => {
    setStatuses((prev) => prev.map((s) => (s._id === updated._id ? normalize(updated) : s)));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusComposer value={postText} onChange={setPostText} onSubmit={submitPost} disabled={submitting} />
      <FlatList
        data={statuses}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <StatusItem
            item={item}
            currentUser={user}
            submitting={submitting}
            onLike={(it) => toggleLike(it)}
            onUnlike={(it) => toggleLike(it)}
            onComment={addComment}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>ยังไม่มีโพสต์</Text>}
        contentContainerStyle={statuses.length === 0 ? styles.center : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
  empty: { color: '#666' },
});
