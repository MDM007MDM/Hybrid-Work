import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function StatusComposer({ value, onChange, onSubmit, disabled }) {
  return (
    <View style={styles.postBox}>
      <TextInput
        style={styles.input}
        placeholder="คุณกำลังคิดอะไรอยู่?"
        value={value}
        onChangeText={onChange}
        multiline
      />
      <Button title="โพสต์" onPress={onSubmit} disabled={disabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  postBox: { padding: 12, borderBottomColor: '#eee', borderBottomWidth: 1, backgroundColor: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
});

