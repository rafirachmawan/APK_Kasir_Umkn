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
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
const { width } = Dimensions.get("window");

export default function ProdukAdmin() {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [kategori, setKategori] = useState("MAKANAN");
  const [gambar, setGambar] = useState<string | undefined>(undefined);
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [tokoId, setTokoId] = useState("");
  const [namaToko, setNamaToko] = useState("");
  const [username, setUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return Alert.alert("Error", "User belum login");
      const user = JSON.parse(userStr);
      setTokoId(user.tokoId);
      setUsername(user.username || "Admin");
      setNamaToko(user.namaToko || "Toko Anda");
      await ambilProduk(user.tokoId);
    };
    init();
  }, []);

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? -width : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(false);
  };

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
    <TouchableWithoutFeedback onPress={closeSidebar}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Sidebar */}
        <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
          <Text style={styles.brandTitle}>CASIRO</Text>
          <View style={styles.sidebarDivider} />

          <TouchableOpacity
            onPress={() => {
              router.replace("/admin/dashboard");
              closeSidebar();
            }}
            style={styles.sidebarItem}
          >
            <Text style={styles.sidebarText}>📊 Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.replace("/admin/produk");
              closeSidebar();
            }}
            style={styles.sidebarItem}
          >
            <Text style={styles.sidebarText}>🛒 Produk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.replace("/admin/laporan");
              closeSidebar();
            }}
            style={styles.sidebarItem}
          >
            <Text style={styles.sidebarText}>📑 Laporan</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Konten Utama */}
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
              <Text style={styles.menuText}>{sidebarOpen ? "✕" : "☰"}</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>
              Halo, {username} dari {namaToko}
            </Text>
          </View>

          <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>🛒 Kelola Produk</Text>

            <Text style={styles.label}>Nama Produk</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Nasi Goreng"
              value={nama}
              onChangeText={setNama}
            />

            <Text style={styles.label}>Harga Produk</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 12000"
              keyboardType="numeric"
              value={harga}
              onChangeText={setHarga}
            />

            <Text style={styles.label}>Kategori</Text>
            <View style={styles.kategoriRow}>
              {kategoriList.map((k) => (
                <TouchableOpacity
                  key={k}
                  onPress={() => setKategori(k)}
                  style={[
                    styles.kategoriBtn,
                    kategori === k && styles.kategoriAktif,
                  ]}
                >
                  <Text style={{ color: kategori === k ? "white" : "black" }}>
                    {k}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={pilihGambar} style={styles.imageBtn}>
              <Text style={{ color: "white", fontWeight: "bold" }}>
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
                  marginVertical: 10,
                }}
              />
            )}

            <TouchableOpacity onPress={tambahProduk} style={styles.addBtn}>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Tambah Produk
              </Text>
            </TouchableOpacity>

            <Text style={[styles.pageTitle, { marginTop: 30 }]}>
              📦 Daftar Produk
            </Text>
            {kategoriList.map((kat) => {
              const produkKat = produkList.filter((p) => p.kategori === kat);
              if (produkKat.length === 0) return null;
              return (
                <View key={kat}>
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
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#4e54c8",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
    flexShrink: 1,
  },
  menuButton: {
    padding: 8,
  },
  menuText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.65,
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 10,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4e54c8",
    textAlign: "center",
    marginBottom: 10,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  sidebarItem: {
    backgroundColor: "#f1f1f1",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  sidebarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 14,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 25,
    backgroundColor: "white",
    marginBottom: 10,
  },
  kategoriRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  kategoriBtn: {
    backgroundColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  kategoriAktif: {
    backgroundColor: "#4e54c8",
  },
  imageBtn: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  addBtn: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 16,
  },
  kategoriJudul: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 16,
  },
  produkItem: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
