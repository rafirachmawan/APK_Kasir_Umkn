import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TransaksiItem {
  nama: string;
  harga: number;
}

interface Transaksi {
  items: TransaksiItem[];
  total: number;
  bayar: number;
  kembali: number;
  waktu: string;
}

export default function RiwayatScreen() {
  const [data, setData] = useState<Transaksi[]>([]);
  const [filtered, setFiltered] = useState<Transaksi[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const saved = await AsyncStorage.getItem("penjualan");
        const parsed: Transaksi[] = saved ? JSON.parse(saved) : [];
        const reversed = parsed.reverse();
        setData(reversed);
        setFiltered(reversed);
      };
      fetchData();
    }, [])
  );

  const filterData = (start: Date | null, end: Date | null) => {
    if (!start || !end) {
      setFiltered(data);
      return;
    }

    const startMs = new Date(start.setHours(0, 0, 0, 0)).getTime();
    const endMs = new Date(end.setHours(23, 59, 59, 999)).getTime();

    const result = data.filter((t) => {
      const waktu = new Date(t.waktu).getTime();
      return waktu >= startMs && waktu <= endMs;
    });

    setFiltered(result);
  };

  const formatTanggal = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;
  };

  const formatWaktuLengkap = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()} ${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Penjualan</Text>

      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          style={styles.filterButton}
        >
          <Text style={styles.filterText}>
            Dari: {startDate ? formatTanggal(startDate.toISOString()) : "-"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          style={styles.filterButton}
        >
          <Text style={styles.filterText}>
            Sampai: {endDate ? formatTanggal(endDate.toISOString()) : "-"}
          </Text>
        </TouchableOpacity>
      </View>

      {(showStartPicker || showEndPicker) && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "android" ? "calendar" : "default"}
          onChange={(event, selectedDate) => {
            if (showStartPicker) {
              setShowStartPicker(false);
              if (selectedDate) {
                setStartDate(selectedDate);
                filterData(selectedDate, endDate);
              }
            }
            if (showEndPicker) {
              setShowEndPicker(false);
              if (selectedDate) {
                setEndDate(selectedDate);
                filterData(startDate, selectedDate);
              }
            }
          }}
        />
      )}

      {filtered.length === 0 ? (
        <Text style={styles.emptyText}>
          Tidak ada transaksi dalam rentang tanggal ini.
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>{formatWaktuLengkap(item.waktu)}</Text>
              {item.items.map((it, idx) => (
                <Text key={idx}>
                  • {it.nama} | Rp {it.harga.toLocaleString("id-ID")}
                </Text>
              ))}
              <Text style={styles.total}>
                Total: Rp {item.total.toLocaleString("id-ID")}
              </Text>
              <Text>Bayar: Rp {item.bayar.toLocaleString("id-ID")}</Text>
              <Text>Kembali: Rp {item.kembali.toLocaleString("id-ID")}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    backgroundColor: "#e0f7f7",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  filterText: {
    textAlign: "center",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
  card: {
    backgroundColor: "#f0fdfd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  date: {
    fontWeight: "bold",
    marginBottom: 6,
    color: "#222",
  },
  total: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#000",
  },
});
