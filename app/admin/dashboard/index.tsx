// AdminDashboard dengan Bottom Drawer Tabs
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminDashboard() {
  const router = useRouter();

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Dashboard Admin UMKM</Text>
        <Text style={styles.subtext}>Silakan pilih menu di bawah.</Text>
      </View>

      {/* Bottom Drawer Tab */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => router.replace("/admin/dashboard")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/admin/produk")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Produk</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/admin/laporan")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Laporan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={logout}
          style={[styles.navItem, { backgroundColor: "red" }]}
        >
          <Text style={[styles.navText, { color: "white" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  navText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
