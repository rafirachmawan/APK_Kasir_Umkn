import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

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

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const saved = await AsyncStorage.getItem("penjualan");
        const parsed: Transaksi[] = saved ? JSON.parse(saved) : [];
        setData(parsed.reverse()); // tampilkan terbaru dulu
      };
      fetchData();
    }, [])
  );

  const formatTanggal = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Riwayat Penjualan</Text>
      {data.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Belum ada transaksi.
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>{formatTanggal(item.waktu)}</Text>
              {item.items.map((it, idx) => (
                <Text key={idx}>
                  - {it.nama} | Rp {it.harga}
                </Text>
              ))}
              <Text style={styles.total}>Total: Rp {item.total}</Text>
              <Text>Bayar: Rp {item.bayar}</Text>
              <Text>Kembali: Rp {item.kembali}</Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#e0f7f7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  date: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  total: {
    marginTop: 6,
    fontWeight: "bold",
  },
});
