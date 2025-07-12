// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDESHIijUmlvNyQXR9ECRdmk7so_Id5Y8U",
  authDomain: "summer-2025-ab.firebaseapp.com",
  projectId: "summer-2025-ab",
  storageBucket: "summer-2025-ab.firebasestorage.app",
  messagingSenderId: "292656167057",
  appId: "1:292656167057:web:d45680ba9b188c3ca76730",
  measurementId: "G-YNYSZPRLWJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };