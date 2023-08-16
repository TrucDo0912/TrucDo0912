// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB00OSaTuZQ_9wXr-eAooDInrF_kFpULF4",
  authDomain: "diemdanh-fingerprint.firebaseapp.com",
  projectId: "diemdanh-fingerprint",
  storageBucket: "diemdanh-fingerprint.appspot.com",
  messagingSenderId: "641565700616",
  appId: "1:641565700616:web:570d3b2705ec050da257bd",
  measurementId: "G-9F6NVMFG6W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);