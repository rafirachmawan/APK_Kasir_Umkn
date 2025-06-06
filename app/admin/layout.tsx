import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/auth/login");
  };

  return (
    <>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: "#008080",
          drawerLabelStyle: { fontSize: 16 },
        }}
        drawerContent={(props) => (
          <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
              <Text style={styles.roleText}>Login sebagai: Admin</Text>
              <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      >
        <Drawer.Screen
          name="dashboard"
          options={{ drawerLabel: "🏠 Dashboard" }}
        />
      </Drawer>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#b00020",
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  roleText: {
    padding: 16,
    fontStyle: "italic",
    color: "#555",
  },
});
