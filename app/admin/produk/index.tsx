// ✅ Kelola Produk - Versi Admin: Produk Berdasarkan tokoId Login + Bottom Bar

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../../utils/firebase";

interface Produk {
  id: string;
  nama: string;
  harga: string;
  kategori: string;
  gambar?: string;
  tokoId: string;
}

const kategoriList = ["MAKANAN", "MINUMAN", "CEMILAN"];

export default function ProdukAdmin() {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [kategori, setKategori] = useState("MAKANAN");
  const [gambar, setGambar] = useState<string | undefined>(undefined);
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [tokoId, setTokoId] = useState("");
  const [tab, setTab] = useState<"produk" | "laporan">("produk");
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return Alert.alert("Error", "User belum login");
      const user = JSON.parse(userStr);
      setTokoId(user.tokoId);
      await ambilProduk(user.tokoId);
    };
    init();
  }, []);

  const ambilProduk = async (tokoId: string) => {
    const q = query(collection(db, "produk"), where("tokoId", "==", tokoId));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Produk)
    );
    setProdukList(data);
  };

  const pilihGambar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled && result.assets.length > 0) {
      setGambar(result.assets[0].uri);
    }
  };

  const tambahProduk = async () => {
    if (!nama || !harga || !kategori) {
      return Alert.alert("Lengkapi semua input");
    }

    if (!tokoId) {
      console.log("❌ tokoId kosong saat tambah produk!");
      return Alert.alert("Error", "Toko ID belum dimuat, coba ulangi.");
    }

    try {
      const newProduk: any = {
        nama,
        harga,
        kategori,
        tokoId,
      };
      if (gambar) newProduk.gambar = gambar;

      await addDoc(collection(db, "produk"), newProduk);

      Alert.alert("Berhasil", "Produk ditambahkan");
      setNama("");
      setHarga("");
      setGambar(undefined);
      await ambilProduk(tokoId);
    } catch (err: any) {
      console.error("❌ Gagal menyimpan produk:", err.message || err);
      Alert.alert("Gagal", "Gagal menyimpan produk");
    }
  };

  const hapusProduk = async (id: string) => {
    await deleteDoc(doc(db, "produk", id));
    ambilProduk();
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

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

        <Text style={{ fontWeight: "bold", marginBottom: 6 }}>Kategori:</Text>
        <View style={styles.kategoriRow}>
          {kategoriList.map((k) => (
            <TouchableOpacity
              key={k}
              style={[
                styles.kategoriBtn,
                kategori === k && styles.kategoriAktif,
              ]}
              onPress={() => setKategori(k)}
            >
              <Text style={{ color: kategori === k ? "white" : "black" }}>
                {k}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={pilihGambar} style={styles.gambarBtn}>
          <Text style={{ color: "white" }}>Pilih Gambar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={tambahProduk} style={styles.tambahBtn}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Tambah Produk
          </Text>
        </TouchableOpacity>

        <Text style={[styles.title, { marginTop: 20 }]}>Daftar Produk</Text>
        {kategoriList.map((kat) => {
          const produkKat = produkList.filter((p) => p.kategori === kat);
          if (produkKat.length === 0) return null;
          return (
            <View key={kat} style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold" }}>{kat}</Text>
              {produkKat.map((p) => (
                <View key={p.id} style={styles.produkItem}>
                  <Text>
                    {p.nama} - Rp{p.harga}
                  </Text>
                  <TouchableOpacity onPress={() => hapusProduk(p.id)}>
                    <Text style={{ color: "red" }}>Hapus</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => setTab("produk")}
          style={[styles.navItem, tab === "produk" && styles.activeNav]}
        >
          <Text style={styles.navText}>Produk</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("laporan")}
          style={[styles.navItem, tab === "laporan" && styles.activeNav]}
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
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  kategoriRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  kategoriBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  kategoriAktif: {
    backgroundColor: "#007AFF",
  },
  gambarBtn: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  tambahBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  produkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
  activeNav: {
    backgroundColor: "#007AFF",
  },
  navText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
