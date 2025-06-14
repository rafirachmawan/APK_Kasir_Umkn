import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    const cekLogin = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) {
        const user = JSON.parse(data);
        if (user.role === "kasir_umkm") router.replace("/kasir/penjualan");
        else router.replace("/admin/dashboard");
      } else {
        router.replace("/auth/login");
      }
    };
    cekLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator />
      <Text style={{ textAlign: "center", marginTop: 10 }}>
        Muat halaman...
      </Text>
    </View>
  );
}
