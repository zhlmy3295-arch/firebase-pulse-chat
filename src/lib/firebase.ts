import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, serverTimestamp, query, orderByChild, remove, set, update, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAYXXUp3PbZ1V7djrSznay69PTvHYIe4uY",
  authDomain: "caat-22ea0.firebaseapp.com",
  databaseURL: "https://caat-22ea0-default-rtdb.firebaseio.com",
  projectId: "caat-22ea0",
  storageBucket: "caat-22ea0.firebasestorage.app",
  messagingSenderId: "1033524289590",
  appId: "1:1033524289590:android:b05801fe1bbe879f74f897"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, push, onValue, serverTimestamp, query, orderByChild, remove, set, update, get };
