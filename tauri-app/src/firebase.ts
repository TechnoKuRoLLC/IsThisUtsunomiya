// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyAGileIv_0rDdc086wh3dxHnRjP_pFyKyg",
  authDomain: "isthisutsunomiyaproject.firebaseapp.com",
  databaseURL: "https://isthisutsunomiyaproject-default-rtdb.firebaseio.com",
  projectId: "isthisutsunomiyaproject",
  storageBucket: "isthisutsunomiyaproject.firebasestorage.app",
  messagingSenderId: "960130877837",
  appId: "1:960130877837:web:7e148c640260d2900ed5c4",
  measurementId: "G-M2G5CGLLND"
};

const app = initializeApp(firebaseConfig);

// Functionsインスタンスを取得
const functions = getFunctions(app);

export { app, functions };
