import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMk7EnnJQ8E7fWmdaSb5IjNzx-WxQMdIA",
  authDomain: "new-jesuspod.firebaseapp.com",
  projectId: "new-jesuspod",
  storageBucket: "new-jesuspod.appspot.com",
  messagingSenderId: "913487026448",
  appId: "1:913487026448:web:6e0de032bd007c36dead95",
  measurementId: "G-QTPEPSCL9L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
