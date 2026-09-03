import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config pública del SDK web de Firebase: no es secreta, la protección real
// vive en las reglas de seguridad de Firestore/Auth (ver README).
const firebaseConfig = {
  apiKey: "AIzaSyDHwKk1i4S9luGzZLwk1EXj0zpZjyVHQ7I",
  authDomain: "prisma-83e5e.firebaseapp.com",
  projectId: "prisma-83e5e",
  storageBucket: "prisma-83e5e.firebasestorage.app",
  messagingSenderId: "152896346656",
  appId: "1:152896346656:web:3b9bf3fbb39a144d27fa45",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
