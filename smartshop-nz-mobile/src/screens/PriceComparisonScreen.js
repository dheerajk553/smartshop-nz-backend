import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Button } from 'react-native';

// Change this to your backend base URL if needed (emulator may need 10.0.2.2)
const API_BASE = 'http://localhost:3000';

export default function PriceComparisonScreen({ route }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(route?.params?.productId || null);
  const [prices, setPrices] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(false);

  useEffect(() => {
    fetchProducts();
    if (selectedProduct) fetchPrices(selectedProduct);
  }, []);

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      setProducts(json);
    } catch (e) {
      console.error('fetchProducts error', e.message || e);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function fetchPrices(productId) {
    setSelectedProduct(productId);
    setLoadingPrices(true);
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/prices`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      // Expecting an array of price records from backend
      setPrices(json);
    } catch (e) {
      console.error('fetchPrices error', e.message || e);
      setPrices([]);
    } finally {
      setLoadingPrices(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Comparison</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products</Text>
        {loadingProducts ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id || item.id || item.barcode}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.productItem, selectedProduct === item._id && styles.selected]}
                onPress={() => fetchPrices(item._id)}
              >
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productBarcode}>{item.barcode}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prices</Text>
        {loadingPrices ? (
          <ActivityIndicator />
        ) : prices.length === 0 ? (
          <Text style={styles.empty}>Select a product to see prices</Text>
        ) : (
          <FlatList
            data={prices}
            keyExtractor={(item, idx) => `${item.store}-${idx}`}
            renderItem={({ item }) => (
              <View style={styles.priceRow}>
                <Text style={styles.store}>{item.store}</Text>
                <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.actions}>
        <Button title="Refresh Products" onPress={fetchProducts} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  section: { marginVertical: 8, flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '500', marginBottom: 6 },
  productItem: { padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#eee', marginBottom: 6 },
  selected: { backgroundColor: '#eef' },
  productName: { fontSize: 14, fontWeight: '500' },
  productBarcode: { fontSize: 12, color: '#666' },
  empty: { color: '#666' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#f2f2f2' },
  store: { fontWeight: '600' },
  price: { color: '#1a73e8', fontWeight: '700' },
  date: { color: '#999', fontSize: 11 },
  actions: { paddingVertical: 12 },
});
