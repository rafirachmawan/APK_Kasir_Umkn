// ✅ DeveloperDashboard.tsx - Versi Final + Sinkronisasi Username Berdasarkan tokoId

import { useRouter } from "expo-router";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../../utils/firebase";

interface Toko {
  id: string; // ini field 'id' dari dokumen, misalnya "toko-rani"
  nama: string;
  alamat?: string;
}

export default function DeveloperDashboard() {
  const [tokoList, setTokoList] = useState<Toko[]>([]);
  const router = useRouter();

  const fetchToko = async () => {
    try {
      const snapshot = await getDocs(collection(db, "toko"));
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: docData.id,
          nama: docData.nama,
          alamat: docData.alamat,
        };
      });
      setTokoList(data);
    } catch (error) {
      console.error("Gagal ambil data toko:", error);
    }
  };

  const sinkronkanUsernameDenganToko = async () => {
    try {
      const tokoSnap = await getDocs(collection(db, "toko"));
      const userSnap = await getDocs(collection(db, "users"));

      const tokoMap: Record<string, string> = {};
      tokoSnap.forEach((doc) => {
        const data = doc.data();
        tokoMap[data.id] = data.nama;
      });

      for (const userDoc of userSnap.docs) {
        const user = userDoc.data();
        const idUser = userDoc.id;
        const tokoId = user.tokoId;

        const namaBaru = tokoMap[tokoId];
        if (namaBaru && user.username !== namaBaru) {
          await updateDoc(doc(db, "users", idUser), {
            username: namaBaru,
          });
          console.log(`✅ User ${idUser} diperbarui: ${namaBaru}`);
        }
      }
    } catch (err) {
      console.error("❌ Gagal sinkronkan username:", err);
    }
  };

  useEffect(() => {
    fetchToko();
    sinkronkanUsernameDenganToko(); // ✅ otomatis sinkron saat dashboard dimuat
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Daftar Toko</Text>
      <FlatList
        data={tokoList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/developer/toko/${item.id}`)}
          >
            <Text style={styles.nama}>{item.nama}</Text>
            {item.alamat && <Text style={styles.alamat}>{item.alamat}</Text>}
          </TouchableOpacity>
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
