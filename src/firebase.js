// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/auth';
import 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmzhlWdYt33NVj24lQ_wLUJldVOkAwF6o",
  authDomain: "trove-time.firebaseapp.com",
  projectId: "trove-time",
  storageBucket: "trove-time.firebasestorage.app",
  messagingSenderId: "804994521143",
  appId: "1:804994521143:web:2ca74ee1c2cf8551d647b2",
  measurementId: "G-KYK4P16KBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app