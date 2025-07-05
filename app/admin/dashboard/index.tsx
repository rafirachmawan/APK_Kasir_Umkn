import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? -width : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(false);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  return (
    <TouchableWithoutFeedback onPress={closeSidebar}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Sidebar */}
        <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
          <Text style={styles.brandTitle}>CASIRO</Text>
          <View style={styles.sidebarDivider} />

          <TouchableOpacity
            onPress={() => {
              router.replace("/admin/dashboard");
              closeSidebar();
            }}
            style={styles.sidebarItem}
          >
            <Text style={styles.sidebarText}>📊 Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.replace("/admin/produk");
              closeSidebar();
            }}
            style={styles.sidebarItem}
          >
            <Text style={styles.sidebarText}>🛒 Produk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.replace("/admin/laporan");
              closeSidebar();
            }}
            style={styles.sidebarItem}
          >
            <Text style={styles.sidebarText}>📑 Laporan</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Main Content */}
        <View style={{ flex: 1 }}>
          <View style={styles.blueHeader}>
            <Text style={styles.blueHeaderText}>📊 Dashboard Admin</Text>
          </View>

          <View style={styles.mainContent}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
              <Text style={styles.menuText}>{sidebarOpen ? "✕" : "☰"}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Dashboard Admin UMKM</Text>
            <Text style={styles.subtext}>Silakan pilih menu di kiri.</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.65,
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 10,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4e54c8",
    textAlign: "center",
    marginBottom: 10,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  sidebarItem: {
    backgroundColor: "#f1f1f1",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  sidebarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  menuButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
  },
  menuText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4e54c8",
  },
  blueHeader: {
    backgroundColor: "#4e54c8",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  blueHeaderText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});
