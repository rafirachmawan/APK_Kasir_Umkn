// Kasir Penjualan - Tambah & Hapus dari Keranjang
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Produk {
  id: string;
  nama: string;
  harga: string;
}

export default function KasirPenjualan() {
  const router = useRouter();
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [keranjang, setKeranjang] = useState<Produk[]>([]);

  useEffect(() => {
    const ambilProduk = async () => {
      const data = await AsyncStorage.getItem("produkList");
      if (data) setProdukList(JSON.parse(data));
    };
    ambilProduk();
  }, []);

  const tambahKeKeranjang = (item: Produk) => {
    setKeranjang([...keranjang, item]);
  };

  const hapusDariKeranjang = (index: number) => {
    const updated = [...keranjang];
    updated.splice(index, 1);
    setKeranjang(updated);
  };

  const totalHarga = keranjang.reduce(
    (total, item) => total + parseInt(item.harga),
    0
  );

  const simpanTransaksi = async () => {
    if (keranjang.length === 0) return Alert.alert("Keranjang kosong");

    const transaksiBaru = {
      id: Date.now().toString(),
      total: totalHarga,
      items: keranjang,
      waktu: new Date().toLocaleString("id-ID"),
    };

    try {
      const dataLama = await AsyncStorage.getItem("riwayatTransaksi");
      const dataArray = dataLama ? JSON.parse(dataLama) : [];
      const updated = [...dataArray, transaksiBaru];
      await AsyncStorage.setItem("riwayatTransaksi", JSON.stringify(updated));
      setKeranjang([]);
      Alert.alert("Transaksi disimpan", `Total: Rp${totalHarga}`);
    } catch (error) {
      Alert.alert("Gagal menyimpan transaksi");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Pilih Produk</Text>

        <FlatList
          data={produkList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => tambahKeKeranjang(item)}
              style={styles.produkItem}
            >
              <Text>
                {item.nama} - Rp{item.harga}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ marginTop: 10 }}>Belum ada produk.</Text>
          }
        />

        <Text style={styles.title}>Keranjang</Text>
        {keranjang.length === 0 ? (
          <Text style={{ marginTop: 10 }}>Belum ada item di keranjang.</Text>
        ) : (
          keranjang.map((item, index) => (
            <View key={index} style={styles.keranjangItem}>
              <Text>
                {item.nama} - Rp{item.harga}
              </Text>
              <TouchableOpacity onPress={() => hapusDariKeranjang(index)}>
                <Text style={styles.hapus}>Hapus</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={{ marginTop: 10, fontWeight: "bold" }}>
          Total: Rp{totalHarga}
        </Text>

        <TouchableOpacity onPress={simpanTransaksi} style={styles.checkoutBtn}>
          <Text style={{ color: "white", textAlign: "center" }}>
            Simpan Transaksi
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
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
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  produkItem: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    marginBottom: 8,
  },
  keranjangItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  hapus: {
    color: "red",
    fontWeight: "bold",
  },
  checkoutBtn: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
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
