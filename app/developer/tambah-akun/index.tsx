import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { db } from "../../../utils/firebase";

export default function TambahAkunScreen() {
  const router = useRouter();

  const [mode, setMode] = useState("tambahToko"); // "tambahToko" | "tambahAkun"
  const [daftarToko, setDaftarToko] = useState<
    { label: string; value: string }[]
  >([]);

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

  const [openToko, setOpenToko] = useState(false);

  useEffect(() => {
    const fetchToko = async () => {
      const snapshot = await getDocs(collection(db, "toko"));
      const list = snapshot.docs.map((doc) => ({
        label: doc.data().nama,
        value: doc.id,
      }));
      setDaftarToko(list);
    };
    fetchToko();
  }, []);

  const simpanAkun = async () => {
    if (!username || !password || !role || !tokoId)
      return Alert.alert("Semua field wajib diisi");

    const cekQuery = query(
      collection(db, "users"),
      where("username", "==", username)
    );
    const cekSnap = await getDocs(cekQuery);
    if (!cekSnap.empty) return Alert.alert("Username sudah digunakan");

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
    setPlan("free");
  };

  const simpanToko = async () => {
    if (!tokoId) return Alert.alert("Nama toko wajib diisi");
    const tokoRef = doc(db, "toko", tokoId);
    const tokoSnap = await getDoc(tokoRef);
    if (tokoSnap.exists()) return Alert.alert("Toko sudah ada");

    await setDoc(tokoRef, { id: tokoId, nama: tokoId });
    Alert.alert("Toko berhasil ditambahkan");
    setTokoId("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Tambah {mode === "tambahAkun" ? "Akun" : "Toko"}
          </Text>

          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <TouchableOpacity
              style={[
                styles.switchBtn,
                mode === "tambahAkun" && styles.activeBtn,
              ]}
              onPress={() => setMode("tambahAkun")}
            >
              <Text style={styles.switchText}>Tambah Akun</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchBtn,
                mode === "tambahToko" && styles.activeBtn,
              ]}
              onPress={() => setMode("tambahToko")}
            >
              <Text style={styles.switchText}>Tambah Toko</Text>
            </TouchableOpacity>
          </View>

          {mode === "tambahAkun" ? (
            <>
              <Text style={styles.label}>Username</Text>
              <TextInput
                placeholder="Username unik"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />

              <Text style={styles.label}>Role</Text>
              <View style={{ zIndex: 3000 }}>
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
              </View>

              <Text style={styles.label}>Toko</Text>
              <View style={{ zIndex: 2000 }}>
                <DropDownPicker
                  open={openToko}
                  value={tokoId}
                  items={daftarToko}
                  setOpen={setOpenToko}
                  setValue={setTokoId}
                  setItems={setDaftarToko}
                  placeholder="Pilih toko"
                  style={styles.dropdown}
                  dropDownContainerStyle={{ borderColor: "#ccc" }}
                />
              </View>

              <Text style={styles.label}>Plan</Text>
              <View style={{ zIndex: 1000 }}>
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
              </View>

              <TouchableOpacity onPress={simpanAkun} style={styles.button}>
                <Text style={styles.btnText}>Simpan Akun</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.label}>Nama Toko (ID)</Text>
              <TextInput
                placeholder="Contoh: toko-abc"
                value={tokoId}
                onChangeText={setTokoId}
                style={styles.input}
              />

              <TouchableOpacity onPress={simpanToko} style={styles.button}>
                <Text style={styles.btnText}>Simpan Toko</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
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
  switchBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginHorizontal: 5,
  },
  activeBtn: {
    backgroundColor: "#007AFF",
  },
  switchText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
