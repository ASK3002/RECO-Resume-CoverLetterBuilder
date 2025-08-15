// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAbLjQOGyLfFiFZtBcHnJHDbHdqTBUpuQs",
  authDomain: "resume-coverletter-build-d7443.firebaseapp.com",
  projectId: "resume-coverletter-build-d7443",
  storageBucket: "resume-coverletter-build-d7443.firebasestorage.app",
  messagingSenderId: "516070761530",
  appId: "1:516070761530:web:7ade2cad7e9c4ec4274103"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
