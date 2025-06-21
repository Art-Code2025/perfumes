import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr-8KXPyqsqcwiDSiIbyn6alhFcQCN4gU",
  authDomain: "perfum-ac.firebaseapp.com",
  projectId: "perfum-ac",
  storageBucket: "perfum-ac.firebasestorage.app",
  messagingSenderId: "429622096271",
  appId: "1:429622096271:web:88876e9ae849344a5d1bfa"
};

let app;
let auth;
let db;

try {
  console.log('🔥 Initializing Firebase with config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  });
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

export { auth, db }; 