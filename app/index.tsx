import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function IndexRedirector() {
  const [status, setStatus] = useState<
    "loading" | "admin" | "kasir" | "unauthenticated"
  >("loading");

  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem("userLoggedIn");
      const role = await AsyncStorage.getItem("userRole");

      if (isLoggedIn === "true" && role === "admin") {
        router.replace("admin/dashboard" as any);
      } else if (isLoggedIn === "true" && role === "kasir") {
        router.replace("kasir" as any);
      } else {
        router.replace("auth/login" as any);
      }
    };

    checkLogin();
  }, []);

  return null;
}
