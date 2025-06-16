import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { db } from "../../../utils/firebase";

interface Toko {
  id: string;
  nama: string;
  alamat?: string;
}

export default function DeveloperDashboard() {
  const [tokoList, setTokoList] = useState<Toko[]>([]);

  const fetchToko = async () => {
    try {
      const snapshot = await getDocs(collection(db, "toko"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Toko[];
      setTokoList(data);
    } catch (error) {
      console.error("Gagal ambil data toko:", error);
    }
  };

  useEffect(() => {
    fetchToko();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Daftar Toko</Text>
      <FlatList
        data={tokoList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nama}>{item.nama}</Text>
            {item.alamat && <Text style={styles.alamat}>{item.alamat}</Text>}
          </View>
        )}
        ListEmptyComponent={<Text>Belum ada toko terdaftar.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  nama: { fontSize: 16, fontWeight: "bold" },
  alamat: { fontSize: 14, color: "#555" },
});
