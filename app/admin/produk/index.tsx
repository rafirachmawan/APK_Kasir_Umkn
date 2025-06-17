import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
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
    if (!tokoId) return Alert.alert("Error", "Toko ID belum dimuat");

    try {
      const newProduk: any = {
        nama,
        harga,
        kategori,
        tokoId,
      };
      if (gambar) newProduk.gambar = gambar;

      // Gunakan ID gabungan dari nama + tokoId
      const docId = `${nama}-${tokoId}`.toLowerCase().replace(/\s+/g, "-");
      await setDoc(doc(db, "produk", docId), newProduk);

      Alert.alert("Berhasil", "Produk ditambahkan");
      setNama("");
      setHarga("");
      setGambar(undefined);
      await ambilProduk(tokoId);
    } catch (err: any) {
      Alert.alert("Gagal", err.message || "Gagal menyimpan produk");
    }
  };

  const hapusProduk = async (id: string) => {
    await deleteDoc(doc(db, "produk", id));
    await ambilProduk(tokoId);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>🛒 Kelola Produk</Text>

        <Text style={styles.sectionLabel}>Nama Produk</Text>
        <TextInput
          placeholder="Contoh: Nasi Goreng"
          value={nama}
          onChangeText={setNama}
          style={styles.input}
        />

        <Text style={styles.sectionLabel}>Harga Produk</Text>
        <TextInput
          placeholder="Contoh: 12000"
          value={harga}
          onChangeText={setHarga}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.sectionLabel}>Kategori</Text>
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
          <Text style={{ color: "white" }}>
            {gambar ? "Ganti Gambar" : "Pilih Gambar"}
          </Text>
        </TouchableOpacity>

        {gambar && (
          <Image
            source={{ uri: gambar }}
            style={{
              width: "100%",
              height: 150,
              borderRadius: 8,
              marginTop: 10,
              marginBottom: 10,
            }}
          />
        )}

        <TouchableOpacity onPress={tambahProduk} style={styles.tambahBtn}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Tambah Produk
          </Text>
        </TouchableOpacity>

        <Text style={[styles.pageTitle, { marginTop: 24 }]}>
          📦 Daftar Produk
        </Text>
        {kategoriList.map((kat) => {
          const produkKat = produkList.filter((p) => p.kategori === kat);
          if (produkKat.length === 0) return null;
          return (
            <View key={kat} style={{ marginBottom: 20 }}>
              <Text style={styles.kategoriJudul}>{kat}</Text>
              {produkKat.map((p) => (
                <View key={p.id} style={styles.produkItem}>
                  <Text style={{ flex: 1 }}>
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
          <Text
            style={[styles.navText, tab === "produk" && { color: "white" }]}
          >
            Produk
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("laporan")}
          style={[styles.navItem, tab === "laporan" && styles.activeNav]}
        >
          <Text
            style={[styles.navText, tab === "laporan" && { color: "white" }]}
          >
            Laporan
          </Text>
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
  container: { padding: 20 },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  sectionLabel: {
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 12,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  kategoriRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  kategoriBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  kategoriAktif: {
    backgroundColor: "#007AFF",
  },
  gambarBtn: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  tambahBtn: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  kategoriJudul: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
  produkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  activeNav: {
    backgroundColor: "#007AFF",
  },
  navText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
