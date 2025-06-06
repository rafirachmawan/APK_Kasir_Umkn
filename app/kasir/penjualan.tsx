// File: app/kasir/penjualan.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PenjualanScreen() {
  const router = useRouter();

  const handleResetLogin = async () => {
    await AsyncStorage.clear();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halaman Penjualan</Text>

      <TouchableOpacity onPress={handleResetLogin} style={styles.resetButton}>
        <Text style={styles.resetText}>🔁 Reset Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  resetButton: {
    marginTop: 30,
    backgroundColor: "#b00020",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetText: {
    color: "white",
    fontWeight: "bold",
  },
});
