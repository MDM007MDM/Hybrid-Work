import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignInScreen from './src/screens/SignInScreen';
import FeedScreen from './src/screens/FeedScreen';
import ClassMembersScreen from './src/screens/ClassMembersScreen';

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [route, setRoute] = useState('feed'); // 'feed' | 'class'

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('auth');
        if (saved) {
          const obj = JSON.parse(saved);
          setToken(obj.token);
          setUser(obj.user);
        }
      } catch (_) {}
      setBooting(false);
    })();
  }, []);

  const onSignedIn = async ({ token: t, user: u }) => {
    setToken(t);
    setUser(u);
    try { await AsyncStorage.setItem('auth', JSON.stringify({ token: t, user: u })); } catch (_) {}
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    setRoute('feed');
    try { await AsyncStorage.removeItem('auth'); } catch (_) {}
  };

  if (booting) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!token ? (
        <SignInScreen onSignedIn={onSignedIn} />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.topbar}>
            <Text style={styles.title}>{route === 'class' ? 'สมาชิกชั้นปี' : 'Feed'}</Text>
            <View style={styles.topbarRight}>
              {route === 'feed' ? (
                <TouchableOpacity onPress={() => setRoute('class')} style={styles.linkButtonRight}>
                  <Text style={styles.linkText}>สมาชิก</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setRoute('feed')} style={styles.linkButtonRight}>
                  <Text style={styles.linkText}>กลับ</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {route === 'feed' ? (
            <FeedScreen token={token} user={user} />
          ) : (
            <ClassMembersScreen token={token} user={user} />
          )}
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f9' },
  topbar: {
    paddingTop: 48,
    paddingLeft: 12,
    paddingRight: 0,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700' },
  topbarRight: { flexDirection: 'row' },
  linkButtonRight: { paddingVertical: 8, paddingHorizontal: 12, marginRight: 0 },
  linkText: { color: '#1877F2', fontWeight: '700' },
});
