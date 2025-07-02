import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as XLSX from "xlsx";

const { width } = Dimensions.get("window");

interface Penjualan {
  id: string;
  tanggal: string;
  total: number;
  kasir: string;
}

export default function LaporanPenjualan() {
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

  const [tanggalDari, setTanggalDari] = useState(new Date());
  const [tanggalSampai, setTanggalSampai] = useState(new Date());
  const [showDari, setShowDari] = useState(false);
  const [showSampai, setShowSampai] = useState(false);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const mockData: Penjualan[] = [
    { id: "1", tanggal: "2025-07-01", total: 120000, kasir: "rani" },
    { id: "2", tanggal: "2025-07-02", total: 250000, kasir: "rani" },
    { id: "3", tanggal: "2025-07-02", total: 180000, kasir: "andi" },
  ];

  const filterData = () => {
    const dari = formatDate(tanggalDari);
    const sampai = formatDate(tanggalSampai);
    return mockData.filter(
      (item) => item.tanggal >= dari && item.tanggal <= sampai
    );
  };

  const exportToExcel = async () => {
    const filtered = filterData();
    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");

    const fileUri = FileSystem.cacheDirectory + "laporan-penjualan.xlsx";
    const binary = XLSX.write(workbook, { type: "binary", bookType: "xlsx" });
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; ++i) {
      view[i] = binary.charCodeAt(i) & 0xff;
    }

    await FileSystem.writeAsStringAsync(fileUri, binary, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Export Laporan Penjualan",
      UTI: "com.microsoft.excel.xlsx",
    });
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

        {/* Konten */}
        <View style={styles.container}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
            <Text style={styles.menuText}>{sidebarOpen ? "✕" : "☰"}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>📊 Laporan Penjualan</Text>

          <View style={styles.dateRow}>
            <TouchableOpacity
              onPress={() => setShowDari(true)}
              style={styles.dateBtn}
            >
              <Text>Dari: {formatDate(tanggalDari)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowSampai(true)}
              style={styles.dateBtn}
            >
              <Text>Sampai: {formatDate(tanggalSampai)}</Text>
            </TouchableOpacity>
          </View>

          {showDari && (
            <DateTimePicker
              value={tanggalDari}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(_, selected) => {
                setShowDari(false);
                if (selected) setTanggalDari(selected);
              }}
            />
          )}
          {showSampai && (
            <DateTimePicker
              value={tanggalSampai}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(_, selected) => {
                setShowSampai(false);
                if (selected) setTanggalSampai(selected);
              }}
            />
          )}

          <FlatList
            data={filterData()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>
                  {item.tanggal} - {item.kasir}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Rp{item.total.toLocaleString()}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 20 }}
          />

          <TouchableOpacity onPress={exportToExcel} style={styles.exportBtn}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              📥 Export ke Excel
            </Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  menuButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 20,
  },
  menuText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4e54c8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  dateBtn: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  exportBtn: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  item: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
