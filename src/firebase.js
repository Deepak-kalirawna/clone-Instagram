import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; //firebase/firestore/lite

const firebaseConfig = {
  apiKey: "AIzaSyAvaKUUQJADKXVmmY459JUneyD-AepHYac",
  authDomain: "clone-instagram-ec198.firebaseapp.com",
  projectId: "clone-instagram-ec198",
  storageBucket: "clone-instagram-ec198.appspot.com",
  messagingSenderId: "864638749579",
  appId: "1:864638749579:web:e12db0c15d862963fafd8e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);
//const provider=new GoogleAuthProvider()

export { db, auth, storage };
