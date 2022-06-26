import { getAuth } from 'firebase/auth';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBi6GiE3EwWQny7qxmjYZypxR9gdtWnDE",
  authDomain: "crud-tutorial-d0752.firebaseapp.com",
  databaseURL: "https://crud-tutorial-d0752-default-rtdb.firebaseio.com",
  projectId: "crud-tutorial-d0752",
  storageBucket: "crud-tutorial-d0752.appspot.com",
  messagingSenderId: "786064546264",
  appId: "1:786064546264:web:e79a3cb4d0dae23cc4faad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()