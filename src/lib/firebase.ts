import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, serverTimestamp, query, orderByChild, equalTo, remove, set, update, get } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// الاعدادات بتاعة مشروعك caat-22ea0
const firebaseConfig = {
  apiKey: "AIzaSyC09jKS84TQQY1Xm9AuveqQxEK60lx5hPc",
  authDomain: "caat-22ea0.firebaseapp.com",
  databaseURL: "https://caat-22ea0-default-rtdb.firebaseio.com",
  projectId: "caat-22ea0",
  storageBucket: "caat-22ea0.firebasestorage.app",
  messagingSenderId: "1033524289590",
  appId: "1:1033524289590:web:66bf11a09f04a5f174f897",
  measurementId: "G-E8SRRTBQK5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth, ref, push, onValue, serverTimestamp, query, orderByChild, equalTo, remove, set, update, get, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
