// firebase/config.js

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


import { getFirestore } from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import { getAuth } from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";




const firebaseConfig = {
  apiKey: "AIzaSyDmE_9j7ldP_qQwB3t19t05xjk-MpC8TAM",
  authDomain: "cancha-sintetica-varsov.firebaseapp.com",
  projectId: "cancha-sintetica-varsov",
  storageBucket: "cancha-sintetica-varsov.firebasestorage.app",
  messagingSenderId: "310412764998",
  appId: "1:310412764998:web:c7addab4969949a5d06747",
  measurementId: "G-ZYN0GM0EB7"
};

const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);

export const auth = getAuth(app);