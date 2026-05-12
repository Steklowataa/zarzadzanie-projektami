import { initializeApp, getApps, getApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, setPersistence, browserSessionPersistence, getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMZsVuv_kPQvlBLBFviL6xgOBcjO_DXzY",
  authDomain: "zarzadzanie-projektami-36986.firebaseapp.com",
  projectId: "zarzadzanie-projektami-36986",
  storageBucket: "zarzadzanie-projektami-36986.firebasestorage.app",
  messagingSenderId: "689304571256",
  appId: "1:689304571256:web:259d80d7f183bd3c690c8d",
  measurementId: "G-Y9WZ6M3NJH"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app)
// export const auth = initializeAuth(app, {
//   persistence: browserSessionPersistence
// })

// setPersistence(auth, browserSessionPersistence)

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);