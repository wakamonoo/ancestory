import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAy4tekaIpT8doUUP0xA2oHeI9n6JgbybU",
  authDomain: "ancestory-c068e.firebaseapp.com",
  projectId: "ancestory-c068e",
  storageBucket: "ancestory-c068e.appspot.com",
  messagingSenderId: "579709470015",
  appId: "1:579709470015:web:adbbc5cba7f4e53f617f8a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleAuthProvider = new GoogleAuthProvider();
const facebookAuthProvider = new FacebookAuthProvider();
facebookAuthProvider.addScope("public_profile");

document.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("google-sign-in-btn");
  const fbBtn = document.getElementById("facebook-sign-in-btn");

  let isLoginInProgress = false;

  // Auth observer with debug
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("[Auth Debug] User logged in:", user.displayName);
      const displayNameEl = document.querySelector(".display-name");
      const profilePhotoEl = document.querySelector(".profile-photo");

      if (displayNameEl) displayNameEl.textContent = user.displayName;
      if (profilePhotoEl) profilePhotoEl.src = user.photoURL;
    } else {
      console.log("[Auth Debug] No user is logged in.");
    }
  });

  // Google Sign-In
  googleBtn?.addEventListener("click", async () => {
    if (isLoginInProgress) return;
    isLoginInProgress = true;

    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      console.log("[Google Sign-In] Success:", user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }, { merge: true });

      console.log("[Google Sign-In] User document updated.");
      window.location.reload();
    } catch (error) {
      console.error("[Google Sign-In] Error:", error);
    } finally {
      isLoginInProgress = false;
    }
  });

  // Facebook Sign-In
  fbBtn?.addEventListener("click", async () => {
    if (isLoginInProgress) return;
    isLoginInProgress = true;

    try {
      const result = await signInWithPopup(auth, facebookAuthProvider);
      const user = result.user;
      console.log("[Facebook Sign-In] Success:", user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }, { merge: true });

      console.log("[Facebook Sign-In] User document updated.");
      window.location.reload();
    } catch (error) {
      console.error("[Facebook Sign-In] Error:", error);
    } finally {
      isLoginInProgress = false;
    }
  });
});


window.openLoginModal = () => {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "block";
  }
};

window.closeLoginModal = () => {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "none";
  }
};
