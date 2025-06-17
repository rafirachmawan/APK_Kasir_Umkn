// ✅ File: app/developer/toko/[id].tsx

import { useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { db } from "../../../utils/firebase";

export default function TokoDetailScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [produk, setProduk] = useState<any[]>([]);
  const [akun, setAkun] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      // Ambil produk dari tokoId
      const produkSnap = await getDocs(
        query(collection(db, "produk"), where("tokoId", "==", id))
      );
      const akunSnap = await getDocs(
        query(collection(db, "users"), where("tokoId", "==", id))
      );

      setProduk(produkSnap.docs.map((doc) => doc.data()));
      setAkun(akunSnap.docs.map((doc) => doc.data()));
    } catch (err) {
      console.error("Gagal ambil data detail toko:", err);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📦 Produk Dijual ({produk.length})</Text>
      {produk.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.nama}>{item.nama}</Text>
          <Text>Kategori: {item.kategori}</Text>
          <Text>Harga: Rp {item.harga}</Text>
        </View>
      ))}

      <Text style={styles.title}>👤 Akun Terkait ({akun.length})</Text>
      {akun.map((u, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.nama}>{u.username}</Text>
          <Text>Role: {u.role}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 12 },
  card: {
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  nama: { fontWeight: "bold", fontSize: 16 },
});
