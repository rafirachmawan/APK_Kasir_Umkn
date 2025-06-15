// Kasir Penjualan - Simpan Transaksi, Tampilkan Kwitansi & Kirim via WhatsApp + Tampilkan Produk Per Kategori
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Produk {
  id: string;
  nama: string;
  harga: string;
  kategori?: "makanan" | "minuman" | "cemilan";
}

interface Transaksi {
  id: string;
  total: number;
  items: Produk[];
  waktu: string;
}

export default function KasirPenjualan() {
  const router = useRouter();
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [keranjang, setKeranjang] = useState<Produk[]>([]);
  const [lastKwitansi, setLastKwitansi] = useState<Transaksi | null>(null);

  useEffect(() => {
    const ambilProduk = async () => {
      const data = await AsyncStorage.getItem("produkList");
      if (data) {
        const parsed = JSON.parse(data);
        const withKategori = parsed.map((p: any) => ({
          ...p,
          kategori: p.kategori ?? "makanan",
        }));
        setProdukList(withKategori);
      }
    };
    ambilProduk();
  }, []);

  const tambahKeKeranjang = (item: Produk) => {
    setKeranjang([...keranjang, item]);
  };

  const hapusDariKeranjang = (index: number) => {
    const updated = [...keranjang];
    updated.splice(index, 1);
    setKeranjang(updated);
  };

  const totalHarga = keranjang.reduce(
    (total, item) => total + parseInt(item.harga),
    0
  );

  const simpanTransaksi = async () => {
    if (keranjang.length === 0) return Alert.alert("Keranjang kosong");

    const transaksiBaru: Transaksi = {
      id: Date.now().toString(),
      total: totalHarga,
      items: keranjang,
      waktu: new Date().toLocaleString("id-ID"),
    };

    try {
      const dataLama = await AsyncStorage.getItem("riwayatTransaksi");
      const dataArray = dataLama ? JSON.parse(dataLama) : [];
      const updated = [...dataArray, transaksiBaru];
      await AsyncStorage.setItem("riwayatTransaksi", JSON.stringify(updated));
      setLastKwitansi(transaksiBaru);
      setKeranjang([]);
      Alert.alert("Transaksi disimpan", `Total: Rp${totalHarga}`);
    } catch (error) {
      Alert.alert("Gagal menyimpan transaksi");
    }
  };

  const kirimWhatsapp = (trx: Transaksi) => {
    const isiPesan =
      `🧾 *Kwitansi Penjualan*\n` +
      `Waktu: ${trx.waktu}\n` +
      trx.items.map((item) => `- ${item.nama}: Rp${item.harga}`).join("\n") +
      `\n\nTotal: *Rp${trx.total}*`;

    const pesanEncoded = encodeURIComponent(isiPesan);
    const link = `https://wa.me/?text=${pesanEncoded}`;
    Linking.openURL(link);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  const kategoriList: Produk["kategori"][] = ["makanan", "minuman", "cemilan"];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Pilih Produk</Text>

        {kategoriList.map((kategori) => {
          const dataKategori = produkList.filter(
            (p) => p.kategori === kategori
          );
          if (dataKategori.length === 0) return null;
          return (
            <View key={kategori} style={{ marginBottom: 12 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
                {typeof kategori === "string" ? kategori.toUpperCase() : ""}
              </Text>
              {dataKategori.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => tambahKeKeranjang(item)}
                  style={styles.produkItem}
                >
                  <Text>
                    {item.nama} - Rp{item.harga}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        <Text style={styles.title}>Keranjang</Text>
        {keranjang.length === 0 ? (
          <Text style={{ marginTop: 10 }}>Belum ada item di keranjang.</Text>
        ) : (
          keranjang.map((item, index) => (
            <View key={index} style={styles.keranjangItem}>
              <Text>
                {item.nama} - Rp{item.harga}
              </Text>
              <TouchableOpacity onPress={() => hapusDariKeranjang(index)}>
                <Text style={styles.hapus}>Hapus</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={{ marginTop: 10, fontWeight: "bold" }}>
          Total: Rp{totalHarga}
        </Text>

        <TouchableOpacity onPress={simpanTransaksi} style={styles.checkoutBtn}>
          <Text style={{ color: "white", textAlign: "center" }}>
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

      {/* Bottom Navigation */}
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  produkItem: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    marginBottom: 8,
  },
  keranjangItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  hapus: {
    color: "red",
    fontWeight: "bold",
  },
  checkoutBtn: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  navText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
