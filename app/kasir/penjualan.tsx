import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Produk {
  id: string;
  nama: string;
  harga: number;
  gambar: ImageSourcePropType;
}

interface CartItem {
  id: string;
  nama: string;
  harga: number;
  jumlah: number;
}

export default function PenjualanScreen() {
  const router = useRouter();
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [keranjang, setKeranjang] = useState<CartItem[]>([]);
  const [uangBayar, setUangBayar] = useState("");
  const [namaPemesan, setNamaPemesan] = useState("");

  useEffect(() => {
    const data: Produk[] = [
      {
        id: "1",
        nama: "Kopi Hitam",
        harga: 8000,
        gambar: require("../../assets/images/kopi.jpg"),
      },
      {
        id: "2",
        nama: "Teh Manis",
        harga: 6000,
        gambar: require("../../assets/images/kopi.jpg"),
      },
      {
        id: "3",
        nama: "Susu Dingin",
        harga: 10000,
        gambar: require("../../assets/images/kopi.jpg"),
      },
      {
        id: "4",
        nama: "Roti Bakar",
        harga: 12000,
        gambar: require("../../assets/images/kopi.jpg"),
      },
      {
        id: "5",
        nama: "Air Mineral",
        harga: 3000,
        gambar: require("../../assets/images/kopi.jpg"),
      },
      {
        id: "6",
        nama: "Mie Instan",
        harga: 7000,
        gambar: require("../../assets/images/kopi.jpg"),
      },
    ];
    setProdukList(data);
  }, []);

  const tambahItem = (produk: Produk | CartItem) => {
    setKeranjang((prev) => {
      const existing = prev.find((item) => item.id === produk.id);
      if (existing) {
        return prev.map((item) =>
          item.id === produk.id ? { ...item, jumlah: item.jumlah + 1 } : item
        );
      } else {
        return [
          ...prev,
          { id: produk.id, nama: produk.nama, harga: produk.harga, jumlah: 1 },
        ];
      }
    });
  };

  const kurangiItem = (id: string) => {
    setKeranjang((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, jumlah: item.jumlah - 1 } : item
        )
        .filter((item) => item.jumlah > 0)
    );
  };

  const total = keranjang.reduce(
    (sum, item) => sum + item.harga * item.jumlah,
    0
  );

  const handleBayar = async () => {
    const bayar = parseInt(uangBayar.replace(/[^\d]/g, ""));
    if (!namaPemesan) {
      Alert.alert("Nama pemesan wajib diisi");
      return;
    }
    if (isNaN(bayar) || bayar < total) {
      Alert.alert("Uang tidak cukup atau tidak valid");
      return;
    }
    const transaksi = {
      items: keranjang,
      total,
      bayar,
      kembali: bayar - total,
      waktu: new Date().toISOString(),
      namaPemesan,
    };
    const existing = await AsyncStorage.getItem("penjualan");
    const list = existing ? JSON.parse(existing) : [];
    await AsyncStorage.setItem(
      "penjualan",
      JSON.stringify([...list, transaksi])
    );
    await AsyncStorage.setItem("lastKwitansi", JSON.stringify(transaksi));
    setKeranjang([]);
    setUangBayar("");
    setNamaPemesan("");
    router.push("/kasir/kwitansi");
  };

  const formatUang = (value: string) => {
    const angka = value.replace(/[^\d]/g, "");
    if (!angka) return "";
    return "Rp " + parseInt(angka).toLocaleString("id-ID");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Produk Grid */}
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={styles.sectionTitle}>Menu</Text>
        <FlatList
          data={produkList}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => tambahItem(item)}
            >
              <Image source={item.gambar} style={styles.productImage} />
              <Text style={styles.productName}>{item.nama}</Text>
              <Text style={styles.productPrice}>
                Rp {item.harga.toLocaleString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Keranjang di bawah */}
      <View style={styles.cartPanel}>
        <ScrollView style={{ maxHeight: 160 }}>
          {keranjang.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={{ flex: 1 }}>
                <Text>{item.nama}</Text>
                <Text style={{ color: "gray" }}>
                  Rp {item.harga.toLocaleString()}
                </Text>
              </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity onPress={() => kurangiItem(item.id)}>
                  <Text style={styles.qtyBtn}>-</Text>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 8 }}>{item.jumlah}</Text>
                <TouchableOpacity onPress={() => tambahItem(item)}>
                  <Text style={styles.qtyBtn}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <TextInput
          placeholder="Nama Pemesan"
          value={namaPemesan}
          onChangeText={setNamaPemesan}
          style={styles.input}
        />
        <TextInput
          placeholder="Masukkan uang bayar"
          keyboardType="numeric"
          value={formatUang(uangBayar)}
          onChangeText={(text) => setUangBayar(text.replace(/[^\d]/g, ""))}
          style={styles.input}
        />
        <Text style={styles.totalText}>Total: Rp {total.toLocaleString()}</Text>
        <TouchableOpacity style={styles.bayarButton} onPress={handleBayar}>
          <Text style={{ color: "white", fontWeight: "bold" }}>BAYAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    margin: 6,
    flex: 1,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginBottom: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 12,
    color: "gray",
  },
  cartPanel: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "right",
  },
  bayarButton: {
    backgroundColor: "#008080",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
});
