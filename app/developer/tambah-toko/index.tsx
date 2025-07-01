"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
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
import { db } from "../../../utils/firebase";

interface TambahTokoProps {
  onSukses?: () => void;
}

export default function TambahToko({ onSukses }: TambahTokoProps) {
  const [tokoId, setTokoId] = useState("");
  const [loading, setLoading] = useState(false);

  const simpanToko = async () => {
    if (!tokoId) return Alert.alert("Nama toko wajib diisi");

    try {
      setLoading(true);
      const tokoRef = doc(db, "toko", tokoId);
      const tokoSnap = await getDoc(tokoRef);
      if (tokoSnap.exists()) {
        Alert.alert("Toko sudah ada");
      } else {
        await setDoc(tokoRef, {
          id: tokoId,
          nama: tokoId,
        });
        Alert.alert("Toko berhasil ditambahkan");
        setTokoId("");
        if (onSukses) onSukses();
      }
    } catch (error) {
      console.error("Gagal tambah toko:", error);
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Tambah Toko</Text>

          <Text style={styles.label}>Nama Toko (ID)</Text>
          <TextInput
            placeholder="Contoh: toko-abc"
            value={tokoId}
            onChangeText={setTokoId}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={simpanToko}
            style={[styles.button, loading && { opacity: 0.6 }]}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Menyimpan..." : "Simpan Toko"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontWeight: "bold", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  btnText: { color: "white", fontWeight: "bold", textAlign: "center" },
});
