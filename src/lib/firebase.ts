import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC09jKS84TQQY1Xm9AuveqQxEK60lx5hPc",
  authDomain: "caat-22ea0.firebaseapp.com",
  databaseURL: "https://caat-22ea0-default-rtdb.firebaseio.com",
  projectId: "caat-22ea0",
  storageBucket: "caat-22ea0.firebasestorage.app",
  messagingSenderId: "1033524289590",
  appId: "1:1033524289590:web:95b79ea6d633724774f897",
  measurementId: "G-K5FETP0M67"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
