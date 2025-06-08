import * as ImagePicker from "expo-image-picker";
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
import { v4 as uuidv4 } from "uuid";
import {
  Produk,
  getProdukList,
  simpanProdukList,
} from "../../utils/produkManager";

export default function ProdukAdminScreen() {
  const router = useRouter();
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [gambar, setGambar] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getProdukList();
    setProdukList(data);
  };

  const pilihGambar = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Izin ditolak",
        "Akses galeri diperlukan untuk upload gambar."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setGambar(result.assets[0].uri);
    }
  };

  const tambahProduk = async () => {
    if (!nama || !harga) return Alert.alert("Isi nama dan harga");
    const baru: Produk = {
      id: uuidv4(),
      nama,
      harga: parseInt(harga),
      gambar: gambar || "",
    };
    const updated = [...produkList, baru];
    await simpanProdukList(updated);
    setNama("");
    setHarga("");
    setGambar(null);
    setProdukList(updated);
  };

  const hapusProduk = async (id: string) => {
    const updated = produkList.filter((p) => p.id !== id);
    await simpanProdukList(updated);
    setProdukList(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kelola Produk</Text>

      <TouchableOpacity onPress={pilihGambar} style={styles.uploadBox}>
        {gambar ? (
          <Image source={{ uri: gambar }} style={styles.uploadedImage} />
        ) : (
          <Text style={{ color: "#888" }}>📷 Pilih Gambar Produk</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Nama Produk"
        value={nama}
        onChangeText={setNama}
        style={styles.input}
      />
      <TextInput
        placeholder="Harga (contoh: 10000)"
        value={harga}
        onChangeText={setHarga}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity onPress={tambahProduk} style={styles.button}>
        <Text style={styles.buttonText}>Tambah Produk</Text>
      </TouchableOpacity>

      <FlatList
        data={produkList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {item.gambar ? (
              <Image source={{ uri: item.gambar }} style={styles.itemImage} />
            ) : (
              <View style={styles.itemImagePlaceholder}>
                <Text style={{ color: "#aaa" }}>No Image</Text>
              </View>
            )}
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text style={styles.itemName}>{item.nama}</Text>
              <Text style={styles.itemPrice}>
                Rp {item.harga.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity onPress={() => hapusProduk(item.id)}>
              <Text style={styles.hapus}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Tombol kembali ke dashboard */}
      <TouchableOpacity
        onPress={() => router.push("/admin/dashboard")}
        style={[styles.button, { backgroundColor: "#555", marginTop: 20 }]}
      >
        <Text style={styles.buttonText}>⬅️ Kembali ke Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  uploadBox: {
    height: 140,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  itemName: { fontWeight: "bold", fontSize: 14 },
  itemPrice: { color: "#444", fontSize: 13 },
  hapus: { color: "red", marginLeft: 10 },
});
