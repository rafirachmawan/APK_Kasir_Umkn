import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageSourcePropType,
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
  gambar: ImageSourcePropType;
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
        gambar: require("../../assets/images/kopi.jpg"),
      },
      {
        id: "2",
        nama: "Teh Manis",
        harga: 6000,
        gambar: require("../../assets/images/kopi.jpg"),
      },
      {
        id: "3",
        nama: "Susu Dingin",
        harga: 10000,
        gambar: require("../../assets/images/kopi.jpg"),
      },
      {
        id: "4",
        nama: "Roti Bakar",
        harga: 12000,
        gambar: require("../../assets/images/kopi.jpg"),
      },
      {
        id: "5",
        nama: "Air Mineral",
        harga: 3000,
        gambar: require("../../assets/images/kopi.jpg"),
      },
      {
        id: "6",
        nama: "Mie Instan",
        harga: 7000,
        gambar: require("../../assets/images/kopi.jpg"),
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
    const sanitizedBayar = uangBayar.replace(/[^\d]/g, "");
    const bayar = parseInt(sanitizedBayar);

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

    // Reset state
    setKeranjang([]);
    setUangBayar("");
    setTotal(0);

    router.push("/kasir/kwitansi");
  };

  const formatUang = (value: string) => {
    const angka = value.replace(/[^\d]/g, "");
    if (!angka) return "";
    return "Rp " + parseInt(angka).toLocaleString("id-ID");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tokoName}>Toko Custom Name</Text>
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
            <Image source={item.gambar} style={styles.produkImage} />
            <Text style={styles.produkNama}>{item.nama}</Text>
            <Text style={styles.produkHarga}>Rp {item.harga}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.header}>Ringkasan</Text>
      {keranjang.map((item, index) => (
        <View key={index} style={styles.ringkasanItem}>
          <Text>
            {item.nama} - Rp {item.harga.toLocaleString("id-ID")}
          </Text>
          <TouchableOpacity onPress={() => handleHapusItem(index)}>
            <Text style={styles.hapusText}>❌</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.total}>
        Total: Rp {total.toLocaleString("id-ID")}
      </Text>

      <TextInput
        placeholder="Masukkan uang bayar"
        keyboardType="numeric"
        value={formatUang(uangBayar)}
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
  tokoName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#008080",
    marginBottom: 6,
  },
  header: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  produkItem: {
    backgroundColor: "#e0f7f7",
    padding: 12,
    margin: 6,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  produkImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
    borderRadius: 8,
    resizeMode: "cover",
  },
  produkNama: { fontSize: 16 },
  produkHarga: { fontSize: 14, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
    fontSize: 16,
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
