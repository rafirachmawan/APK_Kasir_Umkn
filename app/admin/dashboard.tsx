import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userLoggedIn");
    await AsyncStorage.removeItem("userRole");
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      {/* Label Admin di atas */}
      <Text style={styles.adminLabel}>👤 ADMIN</Text>

      {/* Tombol menu tengah */}
      <View style={styles.middleContainer}>
        <Text style={styles.title}>Dashboard Admin</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/admin/produk")}
        >
          <Text style={styles.buttonText}>➕ Tambah Produk</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={() => router.push("/admin/laporan")}
        >
          <Text style={styles.buttonText}>📊 Laporan Penjualan</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Logout di bawah */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🔐 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between", // agar logout di bawah
    backgroundColor: "white",
  },
  adminLabel: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
  middleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#008080",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "crimson",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
