import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, twitterProvider } from "./firebase";

// Logs in a user using a social provider (Google or Twitter)
const loginWithProvider = async (providerName) => {
  let provider;

  // Select the correct Firebase auth provider based on input
  switch (providerName) {
    case "google":
      provider = googleProvider;
      break;
    case "twitter":
      provider = twitterProvider;
      break;
    default:
      throw new Error("Unsupported provider");
  }

   // Open Firebase popup for user authentication
  const result = await signInWithPopup(auth, provider);

   // Get Firebase ID token for authenticated user
  const idToken = await result.user.getIdToken();

  // Backend API URL from environment variable
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  // Send ID token to backend for verification and login
  const res = await fetch(`${API_URL}/api/v1/auth/firebase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ idToken })
  });

  if (!res.ok) throw new Error("Backend Firebase login failed");

  return await res.json();
};

export default loginWithProvider;
