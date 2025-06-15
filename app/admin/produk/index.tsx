// KelolaProduk - Tambah Kategori & Gambar Produk + Grup Berdasarkan Kategori
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
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
  kategori: "makanan" | "minuman" | "cemilan";
  gambar?: string;
}

export default function KelolaProduk() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [kategori, setKategori] = useState<Produk["kategori"]>("makanan");
  const [gambar, setGambar] = useState<string | undefined>(undefined);
  const [produkList, setProdukList] = useState<Produk[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("produkList").then((data) => {
      if (data) {
        const parsed = JSON.parse(data);
        const fixed = parsed.map((p: any) => ({
          ...p,
          kategori: p.kategori ?? "makanan",
        }));
        setProdukList(fixed);
      }
    });
  }, []);

  const pilihGambar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setGambar(result.assets[0].uri);
    }
  };

  const simpanProduk = async () => {
    if (!nama || !harga) return Alert.alert("Wajib isi nama dan harga");
    const newProduk: Produk = {
      id: Date.now().toString(),
      nama,
      harga,
      kategori,
      gambar,
    };
    const updated = [...produkList, newProduk];
    setProdukList(updated);
    await AsyncStorage.setItem("produkList", JSON.stringify(updated));
    setNama("");
    setHarga("");
    setGambar(undefined);
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

  const kategoriList: Produk["kategori"][] = ["makanan", "minuman", "cemilan"];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
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
        <Text style={{ marginBottom: 5 }}>Kategori:</Text>
        <View style={styles.kategoriWrapper}>
          {kategoriList.map((k) => (
            <TouchableOpacity
              key={k}
              onPress={() => setKategori(k)}
              style={[
                styles.kategoriBtn,
                kategori === k && styles.kategoriActive,
              ]}
            >
              <Text style={kategori === k ? { color: "white" } : {}}>
                {k.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={pilihGambar} style={styles.pilihGambarBtn}>
          <Text style={{ color: "white", textAlign: "center" }}>
            Pilih Gambar
          </Text>
        </TouchableOpacity>
        {gambar && (
          <Image
            source={{ uri: gambar }}
            style={{ width: 100, height: 100, marginVertical: 10 }}
          />
        )}

        <TouchableOpacity onPress={simpanProduk} style={styles.button}>
          <Text style={styles.btnText}>Tambah Produk</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { fontSize: 18, marginTop: 20 }]}>
          Daftar Produk
        </Text>
        {kategoriList.map((kategoriItem) => {
          const filtered = produkList.filter(
            (p) => p.kategori === kategoriItem
          );
          if (filtered.length === 0) return null;
          return (
            <View key={kategoriItem} style={{ marginBottom: 20 }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 16, marginBottom: 6 }}
              >
                {kategoriItem.toUpperCase()}
              </Text>
              {filtered.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text>
                      {item.nama} - Rp{item.harga}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      {item.kategori?.toUpperCase() ?? "-"}
                    </Text>
                  </View>
                  {item.gambar && (
                    <Image
                      source={{ uri: item.gambar }}
                      style={{ width: 40, height: 40, marginRight: 10 }}
                    />
                  )}
                  <TouchableOpacity onPress={() => hapusProduk(item.id)}>
                    <Text style={styles.hapus}>Hapus</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>

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
    alignItems: "center",
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
  kategoriWrapper: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 6,
  },
  kategoriBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#aaa",
  },
  kategoriActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  pilihGambarBtn: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});
