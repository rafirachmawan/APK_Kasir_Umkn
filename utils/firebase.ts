// utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdsipuS5ZZFQtjSup6crN23nhsOCiFaXg",
  authDomain: "kasir-umkm-a2973.firebaseapp.com",
  projectId: "kasir-umkm-a2973",
  storageBucket: "kasir-umkm-a2973.firebasestorage.app",
  messagingSenderId: "575114673695",
  appId: "1:575114673695:web:74e14e70e713cea735df2a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
