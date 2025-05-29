import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Kasir UMKM</Text>
      <Link href="/penjualan" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Mulai Penjualan</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/produk" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Kelola Produk</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/laporan" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Laporan Penjualan</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  button: {
    backgroundColor: "#008080",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    width: 200,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
