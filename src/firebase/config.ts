// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCJSGl_jMuyR2Kdc0VL6VxnD4cGcb-5uME",
    authDomain: "screenshot-b38e4.firebaseapp.com",
    projectId: "screenshot-b38e4",
    storageBucket: "screenshot-b38e4.appspot.com",
    messagingSenderId: "512590489292",
    appId: "1:512590489292:web:7b691becf0661696a88469",
    measurementId: "G-GHHJHN41DF"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };