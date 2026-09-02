// src/firebase.js
import { initializeApp } from "firebase/app"; // Firebase uygulamasını başlatmak için
import { getAuth } from "firebase/auth"; // Kimlik doğrulama için
import { getFirestore } from "firebase/firestore"; // Firestore veritabanı için
import { getStorage } from "firebase/storage"; // Dosya depolama için

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Kullanacağımız Firebase servislerini başlatıp export ediyoruz (dışa aktarıyoruz)
// Böylece projemizin diğer dosyalarından bunlara erişebileceğiz.
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
