import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore/lite"
import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAUI_HAI8c8_DGkv5VTPCid6ip2YAaaNac",
  authDomain: "maktabq-pwa.firebaseapp.com",
  projectId: "maktabq-pwa",
  storageBucket: "maktabq-pwa.appspot.com",
  messagingSenderId: "534154914345",
  appId: "1:534154914345:web:fc2db830bad772a0f38a38",
  measurementId: "G-68GK7Y45MX",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
