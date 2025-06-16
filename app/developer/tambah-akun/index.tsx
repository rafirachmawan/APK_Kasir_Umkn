import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../../utils/firebase";

export default function TambahAkunScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // "admin" atau "kasir"
  const [tokoId, setTokoId] = useState("");
  const [plan, setPlan] = useState("free");

  const simpanAkun = async () => {
    if (!username || !password || !role || !tokoId)
      return Alert.alert("Semua field wajib diisi");

    try {
      await addDoc(collection(db, "users"), {
        username,
        password,
        role,
        tokoId,
        plan,
      });

      Alert.alert("Berhasil", "Akun berhasil ditambahkan");
      setUsername("");
      setPassword("");
      setRole("");
      setTokoId("");
      router.back();
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan akun");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Akun Baru</Text>

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
      <TextInput
        placeholder="Role (admin / kasir)"
        value={role}
        onChangeText={setRole}
        style={styles.input}
      />
      <TextInput
        placeholder="Toko ID"
        value={tokoId}
        onChangeText={setTokoId}
        style={styles.input}
      />
      <TextInput
        placeholder="Plan (free / pro)"
        value={plan}
        onChangeText={setPlan}
        style={styles.input}
      />

      <TouchableOpacity onPress={simpanAkun} style={styles.button}>
        <Text style={styles.btnText}>Simpan Akun</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
  },
  btnText: { color: "white", fontWeight: "bold", textAlign: "center" },
});
