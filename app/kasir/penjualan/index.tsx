import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
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

interface Transaksi {
  id: string;
  total: number;
  items: Produk[];
  waktu: string;
  uangBayar: number;
  kembali: number;
}

export default function KasirPenjualan() {
  const router = useRouter();
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [keranjang, setKeranjang] = useState<Produk[]>([]);
  const [uangBayar, setUangBayar] = useState("");
  const [kategori, setKategori] = useState<"makanan" | "minuman" | "cemilan">(
    "makanan"
  );
  const [namaToko, setNamaToko] = useState("");
  const [lastKwitansi, setLastKwitansi] = useState<Transaksi | null>(null);

  useEffect(() => {
    const ambilData = async () => {
      const data = await AsyncStorage.getItem("produkList");
      const user = await AsyncStorage.getItem("user");
      if (data) {
        const parsed = JSON.parse(data).map((p: any) => ({
          ...p,
          kategori: p.kategori ?? "makanan",
        }));
        setProdukList(parsed);
      }
      if (user) {
        const parsedUser = JSON.parse(user);
        setNamaToko(parsedUser?.tokoNama || "Toko");
      }
    };
    ambilData();
  }, []);

  const tambahKeKeranjang = (item: Produk) => {
    setKeranjang([...keranjang, item]);
  };

  const kurangiSatuItem = (nama: string) => {
    const index = keranjang.findIndex((item) => item.nama === nama);
    if (index !== -1) {
      const baru = [...keranjang];
      baru.splice(index, 1);
      setKeranjang(baru);
    }
  };

  const totalHarga = keranjang.reduce(
    (total, item) => total + parseInt(item.harga),
    0
  );
  const kembali = parseInt(uangBayar || "0") - totalHarga;

  const simpanTransaksi = async () => {
    if (keranjang.length === 0) return Alert.alert("Keranjang kosong");
    if (!uangBayar || parseInt(uangBayar) < totalHarga)
      return Alert.alert("Uang bayar tidak cukup");

    const transaksiBaru: Transaksi = {
      id: Date.now().toString(),
      total: totalHarga,
      items: keranjang,
      waktu: new Date().toLocaleString("id-ID"),
      uangBayar: parseInt(uangBayar),
      kembali,
    };

    const dataLama = await AsyncStorage.getItem("riwayatTransaksi");
    const dataArray = dataLama ? JSON.parse(dataLama) : [];
    const updated = [...dataArray, transaksiBaru];
    await AsyncStorage.setItem("riwayatTransaksi", JSON.stringify(updated));
    setLastKwitansi(transaksiBaru);
    setKeranjang([]);
    setUangBayar("");
    Alert.alert("Transaksi disimpan", `Total: Rp${totalHarga}`);
  };

  const keranjangGrouped = Object.values(
    keranjang.reduce((acc, item) => {
      const key = item.nama;
      if (!acc[key]) {
        acc[key] = { ...item, qty: 1 };
      } else {
        acc[key].qty += 1;
      }
      return acc;
    }, {} as { [key: string]: Produk & { qty: number } })
  );

  const kirimWhatsapp = (trx: Transaksi) => {
    const isiPesan =
      `🧾 *Kwitansi Penjualan*\n` +
      `Waktu: ${trx.waktu}\n` +
      trx.items.map((item) => `- ${item.nama}: Rp${item.harga}`).join("\n") +
      `\n\nTotal: *Rp${trx.total}*\nUang Bayar: Rp${trx.uangBayar}\nKembali: Rp${trx.kembali}`;
    const pesanEncoded = encodeURIComponent(isiPesan);
    const link = `https://wa.me/?text=${pesanEncoded}`;
    Linking.openURL(link);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  const kategoriFilter = ["makanan", "minuman", "cemilan"];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{namaToko}</Text>
      </View>

      {/* KATEGORI */}
      <View style={styles.kategoriRow}>
        {kategoriFilter.map((k) => (
          <TouchableOpacity
            key={k}
            onPress={() => setKategori(k as any)}
            style={[
              styles.kategoriBtn,
              kategori === k && styles.kategoriActive,
            ]}
          >
            <Text
              style={
                kategori === k ? styles.kategoriTextActive : styles.kategoriText
              }
            >
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ paddingHorizontal: 12 }}>
        {/* PRODUK */}
        <FlatList
          data={produkList.filter((p) => p.kategori === kategori)}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => tambahKeKeranjang(item)}
              style={styles.card}
            >
              {item.gambar && (
                <Image source={{ uri: item.gambar }} style={styles.image} />
              )}
              <Text style={styles.nama}>{item.nama}</Text>
              <Text style={styles.harga}>Rp{item.harga}</Text>
            </TouchableOpacity>
          )}
        />

        {/* KERANJANG */}
        <Text style={styles.sectionTitle}>Keranjang</Text>
        {keranjangGrouped.length === 0 ? (
          <Text>Belum ada item di keranjang.</Text>
        ) : (
          keranjangGrouped.map((item, index) => (
            <View key={index} style={styles.keranjangItem}>
              <Text>
                {item.nama} x{item.qty} - Rp{parseInt(item.harga) * item.qty}
              </Text>
              <TouchableOpacity onPress={() => kurangiSatuItem(item.nama)}>
                <Text style={styles.hapus}>Kurangi</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.total}>Total: Rp{totalHarga}</Text>

        <TextInput
          placeholder="Uang Bayar"
          keyboardType="numeric"
          value={uangBayar}
          onChangeText={setUangBayar}
          style={styles.input}
        />
        <Text style={{ marginTop: 6 }}>
          Kembalian: Rp{isNaN(kembali) ? 0 : kembali}
        </Text>

        <TouchableOpacity onPress={simpanTransaksi} style={styles.checkoutBtn}>
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            Simpan Transaksi
          </Text>
        </TouchableOpacity>

        {lastKwitansi && (
          <View style={styles.kwitansi}>
            <Text style={styles.kwitansiTitle}>Kwitansi</Text>
            <Text>Waktu: {lastKwitansi.waktu}</Text>
            {lastKwitansi.items.map((item, idx) => (
              <Text key={idx}>
                - {item.nama}: Rp{item.harga}
              </Text>
            ))}
            <Text style={{ fontWeight: "bold", marginTop: 5 }}>
              Total: Rp{lastKwitansi.total}
            </Text>
            <Text>Uang Bayar: Rp{lastKwitansi.uangBayar}</Text>
            <Text>Kembali: Rp{lastKwitansi.kembali}</Text>
            <TouchableOpacity
              onPress={() => kirimWhatsapp(lastKwitansi)}
              style={styles.waBtn}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Kirim via WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM MENU */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => router.replace("/kasir/penjualan")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Penjualan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/kasir/riwayat")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Riwayat</Text>
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
  header: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  kategoriRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 10,
  },
  kategoriBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  kategoriActive: {
    backgroundColor: "#3b82f6",
  },
  kategoriText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  kategoriTextActive: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
  },
  nama: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  harga: {
    fontSize: 13,
    color: "#555",
  },
  keranjangItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  hapus: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
  total: {
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  checkoutBtn: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 10,
    marginTop: 14,
  },
  kwitansi: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
  },
  kwitansiTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  waBtn: {
    marginTop: 10,
    backgroundColor: "#25D366",
    padding: 10,
    borderRadius: 8,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  navText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
