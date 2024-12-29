import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgY5vgcRsVfBrW2j3nktUektkHnAusuzM",
  authDomain: "todolist-ddc40.firebaseapp.com",
  projectId: "todolist-ddc40",
  storageBucket: "todolist-ddc40.firebasestorage.app",
  messagingSenderId: "140035655967",
  appId: "1:140035655967:web:2816aacc1dd2d821ab082a",
  measurementId: "G-B86F2NZ2KB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
