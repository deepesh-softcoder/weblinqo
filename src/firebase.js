import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";

// firebase configurations key value
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Initialize Firebase app with the above configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication instance
const auth = getAuth(app);

// GoogleAuthProvider: Allows users to sign in with their Google account.
const googleProvider = new GoogleAuthProvider();

// TwitterAuthProvider: Allows users to sign in with their Twitter account.
const twitterProvider = new TwitterAuthProvider();

export { auth, googleProvider, twitterProvider };
