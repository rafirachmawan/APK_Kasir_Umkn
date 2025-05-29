import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as XLSX from "xlsx";

interface Transaksi {
  nama: string;
  jumlah: number;
  total: number;
  waktu: string;
  kasir: string;
  bayar: number;
  kembali: number;
}

export default function Laporan() {
  const [laporan, setLaporan] = useState<Transaksi[]>([]);
  const [filtered, setFiltered] = useState<Transaksi[]>([]);
  const [totalSemua, setTotalSemua] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const router = useRouter();

  const ambilData = async () => {
    const data = await AsyncStorage.getItem("laporan");
    const transaksi: Transaksi[] = data ? JSON.parse(data) : [];
    setLaporan(transaksi);
    setFiltered(transaksi);
    hitungTotal(transaksi);
  };

  const hitungTotal = (list: Transaksi[]) => {
    const total = list.reduce((sum, item) => sum + (item.total || 0), 0);
    setTotalSemua(total);
  };

  useFocusEffect(
    useCallback(() => {
      ambilData();
    }, [])
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    const hasil = laporan.filter((item) =>
      item.nama.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(hasil);
    hitungTotal(hasil);
  };

  const handleFilterByDate = (date: Date) => {
    setSelectedDate(date);
    const tanggalDipilih = date.toDateString();
    const hasil = laporan.filter(
      (item) => new Date(item.waktu).toDateString() === tanggalDipilih
    );
    setFiltered(hasil);
    hitungTotal(hasil);
  };

  const renderItem = ({ item }: { item: Transaksi }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/kwitansi",
          params: {
            nama: item.nama ?? "",
            jumlah: item.jumlah?.toString() ?? "0",
            total: item.total?.toString() ?? "0",
            harga:
              item.jumlah && item.total
                ? (item.total / item.jumlah).toString()
                : "0",
            waktu: item.waktu ?? "",
            kasir: item.kasir ?? "-",
            bayar: item.bayar?.toString() ?? "0",
            kembali: item.kembali?.toString() ?? "0",
          },
        })
      }
    >
      <View style={styles.row}>
        <Text style={styles.kecil}>
          {item.waktu
            ? new Date(item.waktu).toLocaleString("id-ID")
            : "(waktu tidak tersedia)"}
        </Text>
        <Text style={styles.text}>Kasir: {item.kasir}</Text>
        <Text style={styles.text}>
          {item.nama} x{item.jumlah} → Rp {item.total}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const exportToExcel = async () => {
    if (filtered.length === 0) {
      Alert.alert("Kosong", "Tidak ada data untuk diexport.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filtered.map((item) => ({
        Waktu: item.waktu ? new Date(item.waktu).toLocaleString("id-ID") : "",
        Kasir: item.kasir,
        Produk: item.nama,
        Jumlah: item.jumlah,
        Total: item.total,
        Bayar: item.bayar,
        Kembali: item.kembali,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");

    const excelBuffer = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    const filePath = FileSystem.cacheDirectory + "laporan_kasir_umkm.xlsx";
    await FileSystem.writeAsStringAsync(filePath, excelBuffer, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(filePath, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Bagikan laporan Excel",
      UTI: "com.microsoft.excel.xlsx",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Laporan Transaksi</Text>

      <TextInput
        placeholder="Cari produk..."
        value={search}
        onChangeText={handleSearch}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.exportBtn}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.exportText}>📅 Filter Tanggal</Text>
      </TouchableOpacity>

      {selectedDate && (
        <TouchableOpacity
          style={[styles.exportBtn, { backgroundColor: "#999" }]}
          onPress={() => {
            setSelectedDate(null);
            setFiltered(laporan);
            hitungTotal(laporan);
          }}
        >
          <Text style={styles.exportText}>🔁 Reset Tanggal</Text>
        </TouchableOpacity>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) handleFilterByDate(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.exportBtn} onPress={exportToExcel}>
        <Text style={styles.exportText}>📤 Export ke Excel</Text>
      </TouchableOpacity>

      <FlatList
        data={filtered}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View style={styles.total}>
        <Text style={styles.totalText}>Total Semua: Rp {totalSemua}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  exportBtn: {
    backgroundColor: "#008080",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 6,
  },
  exportText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 10,
  },
  text: { fontSize: 16 },
  kecil: { fontSize: 14, color: "#777" },
  total: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
});
