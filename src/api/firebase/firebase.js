// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCELY0VIFsMCp3ksf7eSX8LaLEyB3r5nHs",
  authDomain: "board-e31a1.firebaseapp.com",
  projectId: "board-e31a1",
  storageBucket: "board-e31a1.appspot.com",
  messagingSenderId: "951957720873",
  appId: "1:951957720873:web:4dcf6f354ff72e1a02b138",
  measurementId: "G-Q4WVYWMJ0B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);