import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Produk {
  id: string;
  nama: string;
  harga: string;
}

export const getProdukList = async (): Promise<Produk[]> => {
  const data = await AsyncStorage.getItem("produkList");
  return data ? JSON.parse(data) : [];
};

export const simpanProdukList = async (produk: Produk[]) => {
  await AsyncStorage.setItem("produkList", JSON.stringify(produk));
};
