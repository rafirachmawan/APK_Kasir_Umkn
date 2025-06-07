import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function KasirLayout() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("userLoggedIn");
      setLoggedIn(token === "true");
    };
    checkLogin();
  }, []);

  if (loggedIn === null) return null;
  if (!loggedIn) return <Redirect href="/auth/login" />;

  const handleLogout = async () => {
    Alert.alert("Logout", "Yakin ingin logout?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("userLoggedIn");
          await AsyncStorage.removeItem("userRole");
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const MenuItem = ({
    label,
    icon,
    route,
  }: {
    label: string;
    icon: any;
    route: string;
  }) => (
    <TouchableOpacity
      onPress={() => router.push(route as any)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
      }}
    >
      <Ionicons
        name={icon}
        size={20}
        color="#333"
        style={{ marginRight: 16 }}
      />
      <Text style={{ fontSize: 16 }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: "#008080",
        drawerLabelStyle: { fontSize: 16 },
        headerStyle: { backgroundColor: "#f2f2f2" },
        headerTitleAlign: "center",
      }}
      drawerContent={() => (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <MenuItem
              label="🛒 Penjualan"
              icon="cart-outline"
              route="/kasir/penjualan"
            />
            <MenuItem
              label="📋 Riwayat Transaksi"
              icon="list-outline"
              route="/kasir/riwayat"
            />
            <MenuItem
              label="🧾 Kwitansi"
              icon="receipt-outline"
              route="/kasir/kwitansi"
            />
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              padding: 16,
              borderTopWidth: 1,
              borderColor: "#eee",
              backgroundColor: "white",
            }}
          >
            <Text
              style={{ color: "#b00020", fontWeight: "bold", fontSize: 16 }}
            >
              🚪 Logout
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    />
  );
}
