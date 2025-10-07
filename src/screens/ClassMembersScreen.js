import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';
import { ClassAPI } from '../api/client';
import Avatar from '../components/Avatar';

export default function ClassMembersScreen({ token, user }) {
  const [year, setYear] = useState(user?.education?.enrollmentYear || '');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);

  const fetchMembers = async (y) => {
    const target = (y ?? year).toString().trim();
    if (!target) return;
    setLoading(true);
    try {
      const res = await ClassAPI.listByYear(token, target);
      const arr = res?.data || [];
      setMembers(arr);
    } catch (e) {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (year) fetchMembers(year);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="ปีที่ศึกษา (เช่น 2023)"
          keyboardType="number-pad"
          value={String(year)}
          onChangeText={setYear}
        />
        <Button title="โหลด" onPress={() => fetchMembers(year)} />
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator /></View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Avatar uri={item.image} size={36} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.name}>{item.firstname && item.lastname ? `${item.firstname} ${item.lastname}` : (item.email || 'ไม่ทราบชื่อ')}</Text>
                <Text style={styles.sub}>{item.email}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>ไม่พบสมาชิก</Text>}
          contentContainerStyle={members.length === 0 ? styles.center : undefined}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: { padding: 12, backgroundColor: '#fff', borderBottomColor: '#eee', borderBottomWidth: 1, flexDirection: 'row', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff' },
  name: { fontSize: 16, color: '#222' },
  sub: { color: '#666', fontSize: 12 },
  empty: { color: '#666' },
});

