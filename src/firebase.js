import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDBi1qlh4-H-tXWnoiG_kALx-xk-ZgnGG8",
  authDomain: "cafe-management-system-fbabc.firebaseapp.com",
  projectId: "cafe-management-system-fbabc",
  storageBucket: "cafe-management-system-fbabc.firebasestorage.app",
  messagingSenderId: "30595363507",
  appId: "1:30595363507:web:cc0b2ac0fe7083356f76c6",
  measurementId: "G-0D99QTY3CV",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
