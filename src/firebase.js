import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBZttze0RpM0ol23P9FgwD5g-fbVcJzR1c",
  authDomain: "hospital-quiz.firebaseapp.com",
  databaseURL: "https://hospital-quiz-default-rtdb.firebaseio.com",
  projectId: "hospital-quiz",
  storageBucket: "hospital-quiz.firebasestorage.app",
  messagingSenderId: "834431348229",
  appId: "1:834431348229:web:3a2cffb7b3a868bec6b66c"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); 