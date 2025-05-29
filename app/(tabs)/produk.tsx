// app/(tabs)/produk.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  nama: string;
  harga: number;
}

export default function ProdukScreen() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");

  useEffect(() => {
    ambilProduk();
  }, []);

  const ambilProduk = async () => {
    const data = await AsyncStorage.getItem("produkList");
    const list = data ? JSON.parse(data) : [];
    setProdukList(list);
  };

  const simpanProduk = async () => {
    if (!nama || !harga) {
      Alert.alert("Isi semua kolom!");
      return;
    }

    const hargaAngka = parseInt(harga);
    if (isNaN(hargaAngka)) {
      Alert.alert("Harga harus angka!");
      return;
    }

    const produkBaru = { nama, harga: hargaAngka };
    const update = [...produkList, produkBaru];
    await AsyncStorage.setItem("produkList", JSON.stringify(update));
    setProdukList(update);
    setNama("");
    setHarga("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 Tambah Produk</Text>
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
      <TouchableOpacity style={styles.button} onPress={simpanProduk}>
        <Text style={styles.buttonText}>Simpan Produk</Text>
      </TouchableOpacity>

      <FlatList
        data={produkList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>
              {item.nama} - Rp {item.harga}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#008080",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
