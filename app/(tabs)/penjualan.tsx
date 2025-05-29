import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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

interface Transaksi {
  nama: string;
  jumlah: number;
  total: number;
  waktu: string;
  kasir: string;
  bayar: number;
  kembali: number;
}

const daftarProduk = [
  { label: "Kopi", value: "Kopi", harga: 10000 },
  { label: "Teh", value: "Teh", harga: 8000 },
  { label: "Roti", value: "Roti", harga: 5000 },
];

export default function Penjualan() {
  const [open, setOpen] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState<string | null>(null);
  const [jumlah, setJumlah] = useState<string>("");
  const [kasir, setKasir] = useState<string>("");
  const [bayar, setBayar] = useState<string>("");
  const router = useRouter();

  const simpanTransaksi = async () => {
    const produk = daftarProduk.find((p) => p.value === selectedProduk);
    const qty = parseInt(jumlah);
    const uangBayar = parseInt(bayar);

    if (!produk || !qty || isNaN(qty) || !kasir || isNaN(uangBayar)) {
      Alert.alert("Error", "Pastikan semua kolom terisi dengan benar.");
      return;
    }

    const totalHarga = produk.harga * qty;
    const kembali = uangBayar - totalHarga;

    if (kembali < 0) {
      Alert.alert("Kurang", "Uang yang dibayar kurang dari total.");
      return;
    }

    const transaksi: Transaksi = {
      nama: produk.label,
      jumlah: qty,
      total: totalHarga,
      waktu: new Date().toISOString(),
      kasir: kasir,
      bayar: uangBayar,
      kembali: kembali,
    };

    try {
      const existing = await AsyncStorage.getItem("laporan");
      const laporan: Transaksi[] = existing ? JSON.parse(existing) : [];
      laporan.push(transaksi);
      await AsyncStorage.setItem("laporan", JSON.stringify(laporan));

      router.push({
        pathname: "/kwitansi",
        params: {
          nama: transaksi.nama,
          jumlah: transaksi.jumlah.toString(),
          total: transaksi.total.toString(),
          harga: produk.harga.toString(),
          waktu: transaksi.waktu,
          kasir: transaksi.kasir,
          bayar: transaksi.bayar.toString(),
          kembali: transaksi.kembali.toString(),
        },
      });

      setJumlah("");
      setSelectedProduk(null);
      setBayar("");
      setKasir("");
    } catch (err) {
      Alert.alert("Gagal", "Tidak bisa menyimpan transaksi.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nama Kasir:</Text>
      <TextInput
        value={kasir}
        onChangeText={setKasir}
        placeholder="Masukkan nama kasir"
        style={styles.input}
      />

      <Text style={styles.label}>Pilih Produk:</Text>
      <DropDownPicker
        open={open}
        value={selectedProduk}
        setOpen={setOpen}
        setValue={setSelectedProduk}
        items={daftarProduk.map((item) => ({
          label: item.label,
          value: item.value,
        }))}
        placeholder="Pilih Produk"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdown}
      />

      <Text style={styles.label}>Jumlah:</Text>
      <TextInput
        value={jumlah}
        onChangeText={setJumlah}
        placeholder="Masukkan jumlah"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Uang Bayar:</Text>
      <TextInput
        value={bayar}
        onChangeText={setBayar}
        placeholder="Rp"
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity onPress={simpanTransaksi} style={styles.button}>
        <Text style={styles.buttonText}>Simpan & Cetak Kwitansi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { marginTop: 20, fontSize: 16 },
  dropdown: { marginTop: 10, borderColor: "#ccc" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#008080",
    padding: 15,
    marginTop: 30,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
