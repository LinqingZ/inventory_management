// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADyrhKjhB2PEbROVylSwaEfSQHe-hfYNA",
  authDomain: "inventory-management-1094b.firebaseapp.com",
  projectId: "inventory-management-1094b",
  storageBucket: "inventory-management-1094b.appspot.com",
  messagingSenderId: "48059847070",
  appId: "1:48059847070:web:821d23c0258c38f658468f",
  measurementId: "G-EV8REYHVF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}