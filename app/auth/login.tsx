import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../utils/firebase";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) {
      return Alert.alert("Isi semua data");
    }

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) return Alert.alert("Akun tidak ditemukan");

      const user = snapshot.docs[0].data();
      if (user.password !== password) {
        return Alert.alert("Password salah");
      }

      // Simpan user ke AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(user));

      // Redirect sesuai role
      if (user.role === "developer") router.replace("/developer");
      else if (user.role === "admin") router.replace("/admin/dashboard");
      else if (user.role === "kasir") router.replace("/kasir/penjualan");
      else Alert.alert("Role tidak dikenali");
    } catch (err) {
      Alert.alert("Login gagal", String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Kasir UMKM</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={login} style={styles.button}>
        <Text style={styles.buttonText}>Masuk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
