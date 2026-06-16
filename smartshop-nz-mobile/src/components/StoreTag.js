import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const STORE_COLORS = {
  paknsave: '#FFB400',
  countdown: '#1A73E8',
  newworld: '#34A853',
  woolworths: '#9C27B0',
  default: '#888',
};

export default function StoreTag({ store = '', size = 'small' }) {
  const key = (store || '').toLowerCase();
  const color = STORE_COLORS[key] || STORE_COLORS.default;
  const badgeSize = size === 'large' ? 36 : 20;

  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: color, width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 }]} />
      <Text style={[styles.label, size === 'large' && styles.labelLarge]}>{store}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  badge: { marginRight: 8 },
  label: { fontSize: 12, color: '#222', textTransform: 'capitalize' },
  labelLarge: { fontSize: 16 },
});
