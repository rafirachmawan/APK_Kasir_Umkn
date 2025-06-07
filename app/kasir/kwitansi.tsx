import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Transaksi {
  items: { nama: string; harga: number }[];
  total: number;
  bayar: number;
  kembali: number;
  waktu: string;
}

export default function KwitansiScreen() {
  const router = useRouter();
  const [data, setData] = useState<Transaksi | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const last = await AsyncStorage.getItem("lastKwitansi");
      if (last) setData(JSON.parse(last));
    };
    loadData();
  }, []);

  if (!data) return <Text style={styles.loading}>🕐 Memuat kwitansi...</Text>;

  const { items, total, bayar, kembali, waktu } = data;
  const tanggal = new Date(waktu).toLocaleString("id-ID");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.receiptBox}>
        <Text style={styles.header}>🧾 KWITANSI PENJUALAN</Text>
        <Text style={styles.subText}>Tanggal: {tanggal}</Text>
        <View style={styles.dottedLine} />

        {items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.nama}</Text>
            <Text style={styles.itemPrice}>
              Rp {item.harga.toLocaleString("id-ID")}
            </Text>
          </View>
        ))}

        <View style={styles.dottedLine} />

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.value}>Rp {total.toLocaleString("id-ID")}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Dibayar</Text>
          <Text style={styles.value}>Rp {bayar.toLocaleString("id-ID")}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Kembalian</Text>
          <Text style={styles.value}>Rp {kembali.toLocaleString("id-ID")}</Text>
        </View>

        <View style={styles.dottedLine} />

        <Text style={styles.thankyou}>🙏 Terima kasih atas pembeliannya!</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/kasir/penjualan")}
      >
        <Text style={styles.buttonText}>🔁 Transaksi Baru</Text>
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
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#008080",
    textAlign: "center",
    marginBottom: 6,
  },
  subText: {
    textAlign: "center",
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  dottedLine: {
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: "#aaa",
    marginVertical: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  itemName: {
    fontSize: 16,
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "#333",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  thankyou: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 14,
    color: "#666",
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
