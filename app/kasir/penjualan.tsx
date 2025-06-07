import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Produk {
  id: string;
  nama: string;
  harga: number;
  gambar?: string;
}

interface TransaksiItem {
  nama: string;
  harga: number;
}

export default function PenjualanScreen() {
  const router = useRouter();
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [keranjang, setKeranjang] = useState<TransaksiItem[]>([]);
  const [uangBayar, setUangBayar] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const data: Produk[] = [
      {
        id: "1",
        nama: "Kopi Hitam",
        harga: 8000,
        gambar: "https://via.placeholder.com/100x100.png?text=Kopi",
      },
      {
        id: "2",
        nama: "Teh Manis",
        harga: 6000,
        gambar: "https://via.placeholder.com/100x100.png?text=Teh",
      },
      {
        id: "3",
        nama: "Susu Dingin",
        harga: 10000,
        gambar: "https://via.placeholder.com/100x100.png?text=Susu",
      },
    ];
    setProdukList(data);
  }, []);

  useEffect(() => {
    const sum = keranjang.reduce((acc, item) => acc + item.harga, 0);
    setTotal(sum);
  }, [keranjang]);

  const handleTambahProduk = (item: Produk) => {
    setKeranjang([...keranjang, { nama: item.nama, harga: item.harga }]);
  };

  const handleHapusItem = (index: number) => {
    const newList = [...keranjang];
    newList.splice(index, 1);
    setKeranjang(newList);
  };

  const handleKonfirmasi = async () => {
    const bayar = parseInt(uangBayar);
    if (isNaN(bayar) || bayar < total) {
      Alert.alert("Uang tidak cukup atau tidak valid");
      return;
    }

    const transaksi = {
      items: keranjang,
      total,
      bayar,
      kembali: bayar - total,
      waktu: new Date().toISOString(),
    };

    const existing = await AsyncStorage.getItem("penjualan");
    const list = existing ? JSON.parse(existing) : [];
    await AsyncStorage.setItem(
      "penjualan",
      JSON.stringify([...list, transaksi])
    );
    await AsyncStorage.setItem("lastKwitansi", JSON.stringify(transaksi));

    router.push("/kasir/kwitansi");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pilih Produk</Text>
      <FlatList
        data={produkList}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.produkItem}
            onPress={() => handleTambahProduk(item)}
          >
            <Image source={{ uri: item.gambar }} style={styles.produkImage} />
            <Text style={styles.produkNama}>{item.nama}</Text>
            <Text style={styles.produkHarga}>Rp {item.harga}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.header}>Ringkasan</Text>
      {keranjang.map((item, index) => (
        <View key={index} style={styles.ringkasanItem}>
          <Text>
            {item.nama} - Rp {item.harga}
          </Text>
          <TouchableOpacity onPress={() => handleHapusItem(index)}>
            <Text style={styles.hapusText}>❌</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Text style={styles.total}>Total: Rp {total}</Text>

      <TextInput
        placeholder="Masukkan uang bayar"
        keyboardType="numeric"
        value={uangBayar}
        onChangeText={setUangBayar}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleKonfirmasi}>
        <Text style={styles.buttonText}>Konfirmasi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  produkItem: {
    backgroundColor: "#e0f7f7",
    padding: 12,
    margin: 6,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  produkImage: { width: 60, height: 60, marginBottom: 8, borderRadius: 8 },
  produkNama: { fontSize: 16 },
  produkHarga: { fontSize: 14, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#008080",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
  total: { fontSize: 18, marginVertical: 10 },
  ringkasanItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  hapusText: {
    fontSize: 16,
    color: "#b00020",
    paddingHorizontal: 10,
  },
});
