import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr-8KXPyqsqcwiDSiIbyn6alhFcQCN4gU",
  authDomain: "perfum-ac.firebaseapp.com",
  projectId: "perfum-ac",
  storageBucket: "perfum-ac.firebasestorage.app",
  messagingSenderId: "429622096271",
  appId: "1:429622096271:web:88876e9ae849344a5d1bfa"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 