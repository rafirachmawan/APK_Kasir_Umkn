// Riwayat Transaksi Kasir - Tampilkan Daftar Kwitansi dari AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Transaksi {
  id: string;
  total: number;
  items: { nama: string; harga: string }[];
  waktu: string;
}

export default function RiwayatKwitansi() {
  const router = useRouter();
  const [riwayat, setRiwayat] = useState<Transaksi[]>([]);

  useEffect(() => {
    const ambilData = async () => {
      const data = await AsyncStorage.getItem("riwayatTransaksi");
      if (data) setRiwayat(JSON.parse(data));
    };
    ambilData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Riwayat Transaksi</Text>
        <FlatList
          data={riwayat}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.time}>{item.waktu}</Text>
              {item.items.map((itm, idx) => (
                <Text key={idx}>
                  {itm.nama} - Rp{itm.harga}
                </Text>
              ))}
              <Text style={{ fontWeight: "bold", marginTop: 5 }}>
                Total: Rp{item.total}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ marginTop: 10 }}>Belum ada transaksi.</Text>
          }
        />
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => router.replace("/kasir/penjualan")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Penjualan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/kasir/riwayat")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Riwayat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem("user");
            router.replace("/auth/login");
          }}
          style={[styles.navItem, { backgroundColor: "red" }]}
        >
          <Text style={[styles.navText, { color: "white" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#f4f4f4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  time: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  navText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
