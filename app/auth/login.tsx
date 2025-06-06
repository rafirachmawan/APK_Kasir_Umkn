// File: app/auth/login.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const check = async () => {
      const isLoggedIn = await AsyncStorage.getItem("userLoggedIn");
      const role = await AsyncStorage.getItem("userRole");
      if (isLoggedIn === "true" && role) {
        router.replace(
          role === "admin" ? "/admin/dashboard" : "/kasir/penjualan"
        );
      }
    };
    check();
  }, []);

  const handleLogin = async () => {
    if (username === "admin" && password === "admin") {
      await AsyncStorage.setItem("userLoggedIn", "true");
      await AsyncStorage.setItem("userRole", "admin");
      router.replace("/admin/dashboard");
    } else if (username === "kasir" && password === "kasir") {
      await AsyncStorage.setItem("userLoggedIn", "true");
      await AsyncStorage.setItem("userRole", "kasir");
      router.replace("/kasir/penjualan");
    } else {
      Alert.alert("Login Gagal", "Username atau password salah.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Masuk</Text>
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
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 8,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#008080",
    padding: 14,
    borderRadius: 6,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
