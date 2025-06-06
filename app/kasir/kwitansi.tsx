// File: app/kasir/kwitansi.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Transaksi {
  items: { nama: string; harga: number }[];
  total: number;
  bayar: number;
  kembali: number;
  waktu: string;
}

export default function KwitansiScreen() {
  const router = useRouter();
  const [data, setData] = useState<Transaksi | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const last = await AsyncStorage.getItem("lastKwitansi");
      if (last) setData(JSON.parse(last));
    };
    loadData();
  }, []);

  if (!data) return <Text style={styles.loading}>Memuat kwitansi...</Text>;

  const { items, total, bayar, kembali, waktu } = data;
  const tanggal = new Date(waktu).toLocaleString("id-ID");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🧾 Kwitansi Pembelian</Text>

      <Text style={styles.subText}>Tanggal: {tanggal}</Text>

      <View style={styles.listContainer}>
        {items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.nama}</Text>
            <Text style={styles.itemPrice}>Rp {item.harga}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total: Rp {total}</Text>
        <Text style={styles.summaryText}>Dibayar: Rp {bayar}</Text>
        <Text style={styles.summaryText}>Kembalian: Rp {kembali}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/kasir/penjualan")}
      >
        <Text style={styles.buttonText}>🔄 Transaksi Baru</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#008080",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  listContainer: {
    width: "100%",
    marginVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
  },
  summary: {
    marginVertical: 20,
    width: "100%",
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 2,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#008080",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
