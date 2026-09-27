import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const googleSignUp = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken(true);
    return { user, token, error: null };
  } catch (error) {
    console.error("signin failed:", error);
    return { user: null, token: null, error };
  }
};
