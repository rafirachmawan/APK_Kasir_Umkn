// utils/produkManager.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Produk {
  id: string;
  nama: string;
  harga: number;
  gambar?: string; // optional: URI string untuk gambar produk
}

// Mengambil daftar produk
export const getProdukList = async (): Promise<Produk[]> => {
  try {
    const json = await AsyncStorage.getItem("produkList");
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
    return [];
  }
};

// Menyimpan daftar produk
export const simpanProdukList = async (list: Produk[]) => {
  try {
    await AsyncStorage.setItem("produkList", JSON.stringify(list));
  } catch (error) {
    console.error("Gagal menyimpan produk:", error);
  }
};
