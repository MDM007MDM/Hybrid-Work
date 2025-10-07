import React from 'react';
import { Image, View } from 'react-native';
import { resolveImage } from '../config';

export default function Avatar({ uri, size = 32 }) {
  const src = resolveImage(uri);
  if (!src) {
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#ddd' }} />
    );
  }
  return (
    <Image
      source={{ uri: src }}
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#eee' }}
      resizeMode="cover"
    />
  );
}

