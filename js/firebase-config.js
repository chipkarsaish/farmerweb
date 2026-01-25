// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCwSlrxtKnmfvtKwn5bVjbYzDJ6mn33-70",
    authDomain: "farmerlogin-fbe85.firebaseapp.com",
    projectId: "farmerlogin-fbe85",
    storageBucket: "farmerlogin-fbe85.firebasestorage.app",
    messagingSenderId: "428818050848",
    appId: "1:428818050848:web:650810c202bc189e2a3145",
    measurementId: "G-81Y6K9PVKJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
