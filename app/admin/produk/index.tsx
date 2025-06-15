// KelolaProduk dengan Bottom Drawer Tabs + Tombol Kembali ke Dashboard
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Produk {
  id: string;
  nama: string;
  harga: string;
}

export default function KelolaProduk() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [produkList, setProdukList] = useState<Produk[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("produkList").then((data) => {
      if (data) setProdukList(JSON.parse(data));
    });
  }, []);

  const simpanProduk = async () => {
    if (!nama || !harga) return Alert.alert("Wajib isi nama dan harga");
    const newProduk: Produk = {
      id: Date.now().toString(),
      nama,
      harga,
    };
    const updated = [...produkList, newProduk];
    setProdukList(updated);
    await AsyncStorage.setItem("produkList", JSON.stringify(updated));
    setNama("");
    setHarga("");
  };

  const hapusProduk = async (id: string) => {
    const filtered = produkList.filter((p) => p.id !== id);
    setProdukList(filtered);
    await AsyncStorage.setItem("produkList", JSON.stringify(filtered));
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Kelola Produk</Text>
        <TextInput
          placeholder="Nama Produk"
          value={nama}
          onChangeText={setNama}
          style={styles.input}
        />
        <TextInput
          placeholder="Harga"
          value={harga}
          onChangeText={setHarga}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity onPress={simpanProduk} style={styles.button}>
          <Text style={styles.btnText}>Tambah Produk</Text>
        </TouchableOpacity>

        <FlatList
          data={produkList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text>
                {item.nama} - Rp{item.harga}
              </Text>
              <TouchableOpacity onPress={() => hapusProduk(item.id)}>
                <Text style={styles.hapus}>Hapus</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ marginTop: 20 }}>Belum ada produk.</Text>
          }
          style={{ marginTop: 30 }}
        />
      </View>

      {/* Bottom Drawer Tab */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => router.replace("/admin/dashboard")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/admin/produk")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Produk</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/admin/laporan")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Laporan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={logout}
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  hapus: { color: "red", fontWeight: "bold" },
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
