// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_API_KEY,
  authDomain: "cp-blog-58f28.firebaseapp.com",
  projectId: "cp-blog-58f28",
  storageBucket: "cp-blog-58f28.firebasestorage.app",
  messagingSenderId: "856416880315",
  appId: "1:856416880315:web:712fa9a71e0e0ede2d8b9e",
  measurementId: "G-7E2F14WNY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// export const app = initializeApp(firebaseConfig);
export {app} ;