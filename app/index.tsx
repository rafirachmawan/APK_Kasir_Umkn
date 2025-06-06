import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function IndexRedirector() {
  const [status, setStatus] = useState<
    "loading" | "admin" | "kasir" | "unauthenticated"
  >("loading");

  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem("userLoggedIn");
      const role = await AsyncStorage.getItem("userRole");

      if (isLoggedIn === "true" && role === "admin") {
        setStatus("admin");
      } else if (isLoggedIn === "true" && role === "kasir") {
        setStatus("kasir");
      } else {
        setStatus("unauthenticated");
      }
    };

    checkLogin();
  }, []);

  if (status === "loading") return null;
  if (status === "unauthenticated") return <Redirect href="/auth/login" />;
  if (status === "admin") return <Redirect href="/admin/dashboard" />;
  if (status === "kasir") return <Redirect href="/kasir/penjualan" />;

  return null;
}
