// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_hJ2f_0MVEnqfefL5gZSGeN7hThTw8F0",
  authDomain: "rebbeca-bot.firebaseapp.com",
  projectId: "rebbeca-bot",
  storageBucket: "rebbeca-bot.firebasestorage.app",
  messagingSenderId: "624596716963",
  appId: "1:624596716963:web:3b48587bcc986baf7a9e16",
  measurementId: "G-E0EMNBKRL5"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { app, db, auth, storage };
