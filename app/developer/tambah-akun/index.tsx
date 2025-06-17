// app/developer/tambah-akun/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import DropDownPicker from "react-native-dropdown-picker";
import { db } from "../../../utils/firebase";

interface TambahAkunProps {
  onSukses?: () => void;
}

export default function TambahAkunScreen({ onSukses }: TambahAkunProps) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tokoId, setTokoId] = useState("");

  const [role, setRole] = useState("");
  const [openRole, setOpenRole] = useState(false);
  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Kasir", value: "kasir" },
  ];

  const [plan, setPlan] = useState("free");
  const [openPlan, setOpenPlan] = useState(false);
  const planOptions = [
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
  ];

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

      await addDoc(collection(db, "toko"), {
        id: tokoId,
        nama: tokoId,
      });

      Alert.alert("Berhasil", "Akun berhasil ditambahkan");
      setUsername("");
      setPassword("");
      setRole("");
      setTokoId("");
      setPlan("free");

      if (onSukses) onSukses();
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan akun");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Akun Baru</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        placeholder="Masukkan username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Masukkan password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.label}>Role</Text>
      <DropDownPicker
        open={openRole}
        value={role}
        items={roleOptions}
        setOpen={setOpenRole}
        setValue={setRole}
        setItems={() => {}}
        placeholder="Pilih role"
        style={styles.dropdown}
        dropDownContainerStyle={{ borderColor: "#ccc" }}
      />

      <Text style={styles.label}>Toko ID</Text>
      <TextInput
        placeholder="Misal: toko-abc"
        value={tokoId}
        onChangeText={setTokoId}
        style={styles.input}
      />

      <Text style={styles.label}>Plan</Text>
      <DropDownPicker
        open={openPlan}
        value={plan}
        items={planOptions}
        setOpen={setOpenPlan}
        setValue={setPlan}
        setItems={() => {}}
        placeholder="Pilih plan"
        style={styles.dropdown}
        dropDownContainerStyle={{ borderColor: "#ccc" }}
      />

      <TouchableOpacity onPress={simpanAkun} style={styles.button}>
        <Text style={styles.btnText}>Simpan Akun</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontWeight: "bold", marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  btnText: { color: "white", fontWeight: "bold", textAlign: "center" },
  logoutButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: "red",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
