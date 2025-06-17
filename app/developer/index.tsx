// ✅ app/developer/index.tsx - Developer Dashboard + Tambah Akun + Tab + Fix Back
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeveloperDashboard from "./dashboard/index";
import TambahAkun from "./tambah-akun/index";

export default function DeveloperIndex() {
  const [tab, setTab] = useState<"dashboard" | "akun">("dashboard");
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* Konten berdasarkan tab */}
      <View style={{ flex: 1 }}>
        {tab === "dashboard" ? (
          <DeveloperDashboard />
        ) : (
          <TambahAkun onSukses={() => setTab("dashboard")} />
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
      </View>
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
});
