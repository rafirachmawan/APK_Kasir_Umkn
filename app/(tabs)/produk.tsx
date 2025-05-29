import { StyleSheet, Text, View } from "react-native";

export default function Produk() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Halaman Kelola Produk</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20 },
});
