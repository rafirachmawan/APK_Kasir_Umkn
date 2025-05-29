import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Kwitansi() {
  const { nama, jumlah, total, harga, waktu, kasir, bayar, kembali } =
    useLocalSearchParams();

  const formattedDate = new Date(waktu as string).toLocaleString("id-ID");

  return (
    <View style={styles.container}>
      <Text style={styles.line}>==================</Text>
      <Text style={styles.title}> KWITANSI PENJUALAN</Text>
      <Text style={styles.line}>------------------</Text>
      <Text style={styles.text}>Kasir : {kasir}</Text>
      <Text style={styles.text}>Waktu : {formattedDate}</Text>
      <Text style={styles.line}>------------------</Text>
      <Text style={styles.text}>Produk : {nama}</Text>
      <Text style={styles.text}>Jumlah : {jumlah}</Text>
      <Text style={styles.text}>Harga : Rp {harga}</Text>
      <Text style={styles.line}>------------------</Text>
      <Text style={styles.text}>Total : Rp {total}</Text>
      <Text style={styles.text}>Bayar : Rp {bayar}</Text>
      <Text style={styles.text}>Kembali : Rp {kembali}</Text>
      <Text style={styles.line}>------------------</Text>
      <Text style={styles.footer}>Terima kasih telah berbelanja!</Text>
      <Text style={styles.line}>==================</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  line: {
    fontSize: 16,
    marginVertical: 4,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
  },
  footer: {
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 10,
    textAlign: "center",
  },
});
