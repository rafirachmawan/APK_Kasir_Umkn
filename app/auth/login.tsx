import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { db } from "../../utils/firebase";

const screenWidth = Dimensions.get("window").width;

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) {
      return Alert.alert("Isi semua data");
    }

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) return Alert.alert("Akun tidak ditemukan");

      const user = snapshot.docs[0].data();
      if (user.password !== password) {
        return Alert.alert("Password salah");
      }

      await AsyncStorage.setItem("user", JSON.stringify(user));

      if (user.role === "developer") router.replace("/developer");
      else if (user.role === "admin") router.replace("/admin/dashboard");
      else if (user.role === "kasir") router.replace("/kasir/penjualan");
      else Alert.alert("Role tidak dikenali");
    } catch (err) {
      Alert.alert("Login gagal", String(err));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
        {/* Header dengan wave */}
        <View style={styles.header}>
          {/* Wave di bawah */}
          <Svg
            height="140"
            width={screenWidth}
            viewBox={`0 0 ${screenWidth} 140`}
            style={styles.wave}
          >
            <Path
              d={`
                M0,0 
                C${screenWidth * 0.25},120 ${
                screenWidth * 0.75
              },20 ${screenWidth},100 
                L${screenWidth},140 
                L0,140 
                Z
              `}
              fill="#fff"
            />
          </Svg>

          {/* Logo di atas wave */}
          <Text style={styles.logo}>CASIRO</Text>
        </View>

        {/* Form login */}
        <View style={styles.formContainer}>
          <Text style={styles.welcome}>Welcome back!</Text>

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity onPress={login} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.signup}>
            New user? <Text style={styles.signupLink}>Sign Up</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4f46e5",
    height: 260,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  wave: {
    position: "absolute",
    bottom: 0,
  },
  logo: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 100,
    zIndex: 1,
  },
  formContainer: {
    marginTop: -20,
    marginHorizontal: 24,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signup: {
    textAlign: "center",
    marginTop: 16,
    color: "#666",
  },
  signupLink: {
    color: "#4f46e5",
    fontWeight: "bold",
  },
});
