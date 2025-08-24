import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Your project's Firebase configuration object goes here
  apiKey: "AIzaSyAeYmYKhCj08KubXcs-wACuAk9LrL1Weyk",
  authDomain: "the-scratch-channel.firebaseapp.com",
  projectId: "the-scratch-channel",
  storageBucket: "the-scratch-channel.firebasestorage.app",
  messagingSenderId: "626573218185",
  appId: "1:626573218185:web:185fe5f77ea45c5e831158"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);