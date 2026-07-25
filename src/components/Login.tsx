// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC09jKS84TQQY1Xm9AuveqQxEK60lx5hPc",
  authDomain: "caat-22ea0.firebaseapp.com",
  databaseURL: "https://caat-22ea0-default-rtdb.firebaseio.com",
  projectId: "caat-22ea0",
  storageBucket: "caat-22ea0.firebasestorage.app",
  messagingSenderId: "1033524289590",
  appId: "1:1033524289590:web:753f05df32b8b49474f897",
  measurementId: "G-KWZ5FSJMXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
