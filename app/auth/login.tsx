import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const users = [
  { username: "admin", password: "admin", role: "admin_umkm" },
  { username: "kasir", password: "kasir", role: "kasir_umkm" },
  { username: "dev", password: "dev", role: "developer" },
];

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const cekLogin = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) {
        const user = JSON.parse(data);
        if (user.role === "kasir_umkm") router.replace("/kasir/penjualan");
        else router.replace("/admin/dashboard");
      }
    };
    cekLogin();
  }, []);

  const login = async () => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) return alert("Login gagal");
    await AsyncStorage.setItem("user", JSON.stringify(user));
    if (user.role === "kasir_umkm") router.replace("/kasir/penjualan");
    else router.replace("/admin/dashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Kasir UMKM</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
