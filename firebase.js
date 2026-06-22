import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCamR-1zz2m-Cmv6eZeid9go7z0zZ8YDQQ",
  authDomain: "shared-job-tracker.firebaseapp.com",
  projectId: "shared-job-tracker",
  storageBucket: "shared-job-tracker.firebasestorage.app",
  messagingSenderId: "648808614963",
  appId: "1:648808614963:web:eb382bb3c36f17135d2746",
  measurementId: "G-MZ7ZX3W82T",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export {
  db,
  auth,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
