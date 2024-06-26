import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5aAQ5Tl5v4d0wKwqAU6E8YpXsN1u2v6Y",
  authDomain: "damproyecto-5a6e8.firebaseapp.com",
  projectId: "damproyecto-5a6e8",
  storageBucket: "damproyecto-5a6e8.appspot.com",
  messagingSenderId: "67545820081",
  appId: "1:67545820081:web:601436853eb58a2ab42b90",
  measurementId: "G-PN9C5QY8VM"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

export { storage, auth };
