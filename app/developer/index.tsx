import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeveloperDashboard from "./dashboard/index";
import TambahAkun from "./tambah-akun/index";
import TambahToko from "./tambah-toko/index"; // ✅ import komponen baru

export default function DeveloperIndex() {
  const [tab, setTab] = useState<"dashboard" | "akun" | "toko">("dashboard");
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Logout", "Yakin ingin logout?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          router.replace("/auth/login");
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Konten berdasarkan tab */}
      <View style={{ flex: 1 }}>
        {tab === "dashboard" ? (
          <DeveloperDashboard />
        ) : tab === "akun" ? (
          <TambahAkun onSukses={() => setTab("dashboard")} />
        ) : (
          <TambahToko onSukses={() => setTab("dashboard")} /> // ✅ TambahToko
        )}
      </View>

      {/* Bottom Tabs */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => setTab("dashboard")}
          style={[styles.navItem, tab === "dashboard" && styles.activeNav]}
        >
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTab("akun")}
          style={[styles.navItem, tab === "akun" && styles.activeNav]}
        >
          <Text style={styles.navText}>Tambah Akun</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTab("toko")}
          style={[styles.navItem, tab === "toko" && styles.activeNav]}
        >
          <Text style={styles.navText}>Tambah Toko</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  activeNav: {
    backgroundColor: "#007AFF",
  },
  navText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  logoutButton: {
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
