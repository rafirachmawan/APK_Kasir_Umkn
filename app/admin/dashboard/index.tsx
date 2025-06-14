// AdminDashboard dengan Sliding Sidebar & Overlay
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useState(new Animated.Value(-250))[0];

  const toggleSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: sidebarOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: -250,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setSidebarOpen(false));
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Overlay */}
      {sidebarOpen && (
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Sidebar Slide */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <Text style={styles.logo}>KASIRO</Text>

        <TouchableOpacity
          onPress={() => router.push("/admin/produk")}
          style={styles.menuItem}
        >
          <Text style={styles.menuText}>Kelola Produk</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/admin/laporan")}
          style={styles.menuItem}
        >
          <Text style={styles.menuText}>Laporan Penjualan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={logout}
          style={[styles.menuItem, { marginTop: 30, backgroundColor: "red" }]}
        >
          <Text style={[styles.menuText, { color: "white" }]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Konten utama */}
      <View style={styles.mainContent}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.toggleButton}>
          <Text style={styles.toggleText}>{sidebarOpen ? "✕" : "☰"}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Dashboard Admin UMKM</Text>
        <Text style={styles.subtext}>Silakan pilih menu di sidebar.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    padding: 20,
    borderRightWidth: 1,
    borderColor: "#ccc",
    zIndex: 10,
    elevation: 4,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 5,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 30,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  toggleButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 20,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 20,
  },
  toggleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
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
});
