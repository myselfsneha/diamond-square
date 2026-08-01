import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "diamond-square-6fc82.firebaseapp.com",
  projectId: "diamond-square-6fc82",
  storageBucket: "diamond-square-6fc82.firebasestorage.app",
  messagingSenderId: "842736512820",
  appId: "1:842736512820:web:7b36d9e9971a66d4e6bf61",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);