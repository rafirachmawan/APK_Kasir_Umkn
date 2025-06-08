import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Transaksi {
  items: { nama: string; harga: number; jumlah: number }[];
  total: number;
  bayar: number;
  kembali: number;
  waktu: string;
  namaPemesan: string;
}

export default function LaporanScreen() {
  const router = useRouter();
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [filteredList, setFilteredList] = useState<Transaksi[]>([]);

  const [dateFrom, setDateFrom] = useState<Date>(new Date());
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [transaksiList, dateFrom, dateTo]);

  const loadData = async () => {
    const json = await AsyncStorage.getItem("penjualan");
    const data: Transaksi[] = json ? JSON.parse(json) : [];
    setTransaksiList(data);
  };

  const filterData = () => {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    const filtered = transaksiList.filter((t) => {
      const waktu = new Date(t.waktu);
      return waktu >= from && waktu <= to;
    });
    setFilteredList(filtered);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Laporan Penjualan</Text>

      <View style={styles.dateRow}>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowFrom(true)}
        >
          <Text>Dari: {formatDate(dateFrom)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowTo(true)}
        >
          <Text>Sampai: {formatDate(dateTo)}</Text>
        </TouchableOpacity>
      </View>

      {showFrom && (
        <DateTimePicker
          value={dateFrom}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selected) => {
            setShowFrom(false);
            if (selected) setDateFrom(selected);
          }}
        />
      )}
      {showTo && (
        <DateTimePicker
          value={dateTo}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selected) => {
            setShowTo(false);
            if (selected) setDateTo(selected);
          }}
        />
      )}

      <FlatList
        data={filteredList}
        keyExtractor={(_, index) => index.toString()}
        style={{ marginTop: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardDate}>
              {new Date(item.waktu).toLocaleString("id-ID")}
            </Text>
            <Text style={styles.cardTitle}>👤 {item.namaPemesan}</Text>
            <Text>🧾 Total: Rp {item.total.toLocaleString()}</Text>
            <Text>
              🛒 Jumlah Item: {item.items.reduce((sum, i) => sum + i.jumlah, 0)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Tidak ada transaksi.
          </Text>
        }
      />

      {/* Tombol kembali ke dashboard */}
      <TouchableOpacity
        onPress={() => router.push("/admin/dashboard")}
        style={[styles.button, { backgroundColor: "#555", marginTop: 20 }]}
      >
        <Text style={styles.buttonText}>⬅️ Kembali ke Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    width: "48%",
    backgroundColor: "#f9f9f9",
  },
  card: {
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  cardDate: { fontSize: 12, color: "#666" },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "crimson",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
