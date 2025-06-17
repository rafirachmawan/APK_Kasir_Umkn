import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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
  id: string;
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

  const sinkronkanUserDenganToko = async () => {
    try {
      const tokoSnap = await getDocs(collection(db, "toko"));
      const userSnap = await getDocs(collection(db, "users"));

      const tokoMap: Record<string, string> = {};
      tokoSnap.forEach((doc) => {
        const data = doc.data();
        if (data.id && data.nama) {
          tokoMap[data.id] = data.nama;
        }
      });

      for (const userDoc of userSnap.docs) {
        const userData = userDoc.data();
        const oldDocId = userDoc.id;
        const tokoId = userData.tokoId;

        // ❌ Abaikan akun developer (jangan diubah username-nya)
        if (userData.role === "developer") continue;

        const namaToko = tokoMap[tokoId] || "Unknown";
        const newDocId = tokoId;

        userData.username = namaToko;

        if (oldDocId !== newDocId) {
          await setDoc(doc(db, "users", newDocId), userData);
          await deleteDoc(doc(db, "users", oldDocId));
          console.log(`🔄 User: ${oldDocId} → ${newDocId}`);
        } else {
          await updateDoc(doc(db, "users", oldDocId), {
            username: namaToko,
          });
          console.log(`✅ User: ${oldDocId} diperbarui ke ${namaToko}`);
        }
      }
    } catch (err) {
      console.error("❌ Gagal sinkron user:", err);
    }
  };

  const rapikanDokumenToko = async () => {
    try {
      const snapshot = await getDocs(collection(db, "toko"));
      for (const tokoDoc of snapshot.docs) {
        const data = tokoDoc.data();
        const oldDocId = tokoDoc.id;
        const newDocId = data.id;
        if (!newDocId) continue;

        if (oldDocId !== newDocId) {
          await setDoc(doc(db, "toko", newDocId), data);
          await deleteDoc(doc(db, "toko", oldDocId));
          console.log(`🔄 Toko: ${oldDocId} → ${newDocId}`);
        } else {
          console.log(`✅ Toko: ${newDocId} sudah sesuai`);
        }
      }
    } catch (err) {
      console.error("❌ Gagal rapikan toko:", err);
    }
  };

  const rapikanDokumenProduk = async () => {
    try {
      const produkSnap = await getDocs(collection(db, "produk"));
      for (const produkDoc of produkSnap.docs) {
        const data = produkDoc.data();
        const oldDocId = produkDoc.id;

        if (!data.nama || !data.tokoId) continue;

        const newDocId = `${data.nama}-${data.tokoId}`
          .toLowerCase()
          .replace(/\s+/g, "-");

        if (oldDocId !== newDocId) {
          await setDoc(doc(db, "produk", newDocId), data);
          await deleteDoc(doc(db, "produk", oldDocId));
          console.log(`🔄 Produk: ${oldDocId} → ${newDocId}`);
        } else {
          console.log(`✅ Produk: ${newDocId} sudah sesuai`);
        }
      }
    } catch (err) {
      console.error("❌ Gagal rapikan produk:", err);
    }
  };

  useEffect(() => {
    fetchToko();
    sinkronkanUserDenganToko(); // ✅ sekarang aman untuk developer
    rapikanDokumenToko();
    rapikanDokumenProduk();
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
