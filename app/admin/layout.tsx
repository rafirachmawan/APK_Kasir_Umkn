import { Slot } from "expo-router";
import { Text, View } from "react-native";

export default function AdminLayout() {
  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>
        Admin Panel
      </Text>
      <Slot />
    </View>
  );
}
