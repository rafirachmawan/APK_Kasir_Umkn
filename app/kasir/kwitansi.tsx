import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Item {
  nama: string;
  harga: number;
  jumlah: number;
}

interface Transaksi {
  items: Item[];
  total: number;
  bayar: number;
  kembali: number;
  waktu: string;
  namaPemesan: string;
}

export default function KwitansiScreen() {
  const router = useRouter();
  const [data, setData] = useState<Transaksi | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const last = await AsyncStorage.getItem("lastKwitansi");
        if (last) setData(JSON.parse(last));
      };
      loadData();
    }, [])
  );

  if (!data) return <Text style={styles.loading}>🕐 Memuat kwitansi...</Text>;

  const { items, total, bayar, kembali, waktu, namaPemesan } = data;
  const tanggal = new Date(waktu).toLocaleString("id-ID");

  const handleShareToWhatsApp = () => {
    const pesan = `
🧾 KWITANSI KASIRO
------------------------------
Nama: ${namaPemesan}
Waktu: ${tanggal}
${items
  .map(
    (item) =>
      `${item.jumlah} x ${item.nama} = Rp ${(
        item.jumlah * item.harga
      ).toLocaleString("id-ID")}`
  )
  .join("\n")}
------------------------------
Total: Rp ${total.toLocaleString("id-ID")}
Dibayar: Rp ${bayar.toLocaleString("id-ID")}
Kembalian: Rp ${kembali.toLocaleString("id-ID")}
------------------------------
Terima kasih telah membeli di KASIRO.`;

    const url = `whatsapp://send?text=${encodeURIComponent(pesan)}`;
    Linking.openURL(url).catch(() =>
      Alert.alert(
        "WhatsApp tidak tersedia",
        "Pastikan WhatsApp sudah terinstal di perangkat Anda."
      )
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.receiptBox}>
        <Text style={styles.receiptTitle}>KASIRO</Text>
        <Text style={styles.line}>------------------------------</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>No Nota</Text>
          <Text>: CS/01/{tanggal.replace(/\D/g, "").slice(0, 10)}/0034</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Waktu</Text>
          <Text>: {tanggal}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order</Text>
          <Text>: {namaPemesan}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Kasir</Text>
          <Text>: KASIRO</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Jenis Order</Text>
          <Text>: Free Table</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nama Order</Text>
          <Text>: {namaPemesan}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nomor Meja</Text>
          <Text>: Free Table (1)</Text>
        </View>

        <Text style={styles.line}>------------------------------</Text>

        {items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text>
              {item.jumlah} {item.nama}
            </Text>
            <Text>{(item.harga * item.jumlah).toLocaleString("id-ID")}</Text>
          </View>
        ))}

        <Text style={styles.line}>------------------------------</Text>
        <Text style={styles.summary}>
          Subtotal {items.length} Produk{" "}
          {total.toLocaleString("id-ID").padStart(10)}
        </Text>
        <Text style={styles.summary}>
          Total {" ".repeat(18)}
          {total.toLocaleString("id-ID")}
        </Text>

        <Text style={styles.line}>------------------------------</Text>
        <Text style={styles.summary}>
          Tunai {" ".repeat(20)}
          {bayar.toLocaleString("id-ID")}
        </Text>
        <Text style={styles.summary}>
          Total Bayar {" ".repeat(13)}
          {bayar.toLocaleString("id-ID")}
        </Text>
        <Text style={styles.summary}>
          Kembalian {" ".repeat(15)}
          {kembali.toLocaleString("id-ID")}
        </Text>

        <Text style={styles.line}>------------------------------</Text>
        <Text style={styles.footer}>password wifi : KASIRO2025</Text>
        <Text style={styles.footer}>
          Terbayar {tanggal}
          {"\n"}dicetak: KASIRO
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/kasir/penjualan")}
      >
        <Text style={styles.buttonText}>🔁 Transaksi Baru</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#25D366" }]}
        onPress={handleShareToWhatsApp}
      >
        <Text style={styles.buttonText}>📤 Kirim ke WhatsApp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    flexGrow: 1,
  },
  receiptBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  receiptTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  line: {
    textAlign: "center",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  infoLabel: {
    width: 110,
    fontWeight: "500",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summary: {
    fontFamily: "monospace",
    fontSize: 14,
    marginVertical: 2,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 10,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#008080",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
