import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function AdminDashboard() {
  const router = useRouter();

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Dashboard Admin UMKM</Text>
      <TouchableOpacity
        onPress={logout}
        style={{ backgroundColor: "red", padding: 10, marginTop: 20 }}
      >
        <Text style={{ color: "#fff" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
