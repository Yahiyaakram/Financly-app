// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi9NRQ9eJulzIrUdVI4Y18MGlwgUske2A",
  authDomain: "financly-79475.firebaseapp.com",
  projectId: "financly-79475",
  storageBucket: "financly-79475.firebasestorage.app",
  messagingSenderId: "1018076664501",
  appId: "1:1018076664501:web:86b416a72ac73a538864fc",
  measurementId: "G-R3FMJN0QJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db , auth , provider , doc, setDoc };