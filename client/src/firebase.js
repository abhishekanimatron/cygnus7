// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cygnus-bd951.firebaseapp.com",
  projectId: "cygnus-bd951",
  storageBucket: "cygnus-bd951.appspot.com",
  messagingSenderId: "442377046755",
  appId: "1:442377046755:web:62575ecae39431a17093d6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);