import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="penjualan" options={{ title: "Penjualan" }} />
      <Tabs.Screen name="produk" options={{ title: "Produk" }} />
      <Tabs.Screen name="laporan" options={{ title: "Laporan" }} />
    </Tabs>
  );
}
