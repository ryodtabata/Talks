// Import Firebase services 
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyA5guI2VSY5tBRZ2QcqDQ8T488P5q7k8bU",
  authDomain: "talkalot-d416f.firebaseapp.com",
  projectId: "talkalot-d416f",
  storageBucket: "talkalot-d416f.firebasestorage.app",
  messagingSenderId: "140609420728",
  appId: "1:140609420728:web:37132fbad876d6c496a34d",
  measurementId: "G-1BB1WY3J7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);
const db = getFirestore(app); 
// Initialize Firestore

// Export auth to use in other components
export { auth, db};
