// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1QSg33jrjnj3XiWMX_pFIsz3lFGNARkw",
  authDomain: "notesapp-697ac.firebaseapp.com",
  projectId: "notesapp-697ac",
  storageBucket: "notesapp-697ac.appspot.com",
  messagingSenderId: "179794362285",
  appId: "1:179794362285:web:0513c300ce4454647beb24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);