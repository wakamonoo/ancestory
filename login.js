import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
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
  databaseURL:
    "https://ancestory-c068e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ancestory-c068e",
  storageBucket: "ancestory-c068e.appspot.com",
  messagingSenderId: "579709470015",
  appId: "1:579709470015:web:adbbc5cba7f4e53f617f8a",
  measurementId: "G-S5SQWC7PEM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleAuthProvider = new GoogleAuthProvider();

// Handle redirect result
(async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date(),
        },
        { merge: true }
      );
      
      // Close modal if still open
      const modal = document.getElementById("loginModal");
      if (modal) modal.style.display = "none";
      
      // Refresh only if coming from redirect
      if (sessionStorage.getItem("isRedirecting") === "true") {
        sessionStorage.removeItem("isRedirecting");
        window.location.reload();
      }
    }
  } catch (error) {
    console.error("Redirect error:", error);
    showAuthError(error.message);
  }
})();

// Auth state listener
onAuthStateChanged(auth, (user) => {
  const authStatus = document.getElementById("authStatus");
  if (authStatus) {
    authStatus.textContent = user ? `Logged in as ${user.displayName}` : "Not logged in";
  }
});

// Error handling
function showAuthError(message) {
  const errorDiv = document.getElementById("auth-error");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    setTimeout(() => errorDiv.style.display = "none", 5000);
  }
}

// Login Modal Logic
document.addEventListener("DOMContentLoaded", () => {
  const googleSignInBtn = document.getElementById("google-sign-in-btn");
  const loginModal = document.getElementById("loginModal");
  const closeBtn = loginModal?.querySelector(".close");

  // Mobile-friendly sign-in handler
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener("click", async () => {
      try {
        googleSignInBtn.innerHTML = '<div class="spinner"></div> Redirecting...';
        sessionStorage.setItem("isRedirecting", "true");
        await signInWithRedirect(auth, googleAuthProvider);
      } catch (error) {
        console.error("Sign-in error:", error);
        showAuthError(error.message);
        googleSignInBtn.textContent = "Continue with Google";
      }
    });
  }

  // Modal controls
  const openLoginModal = () => loginModal && (loginModal.style.display = "block");
  const closeLoginModal = () => loginModal && (loginModal.style.display = "none");

  // Modal triggers
  document.querySelectorAll('[data-login-trigger]').forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openLoginModal();
    });
  });

  // Close modal
  if (closeBtn) closeBtn.addEventListener("click", closeLoginModal);
  window.addEventListener("click", (e) => e.target === loginModal && closeLoginModal());

  // Auto-show modal after 5s if not logged in
  setTimeout(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user && loginModal) {
        loginModal.style.display = "block";
      }
    });
  }, 5000);
});

// Global functions
window.openLoginModal = () => document.getElementById("loginModal").style.display = "block";
window.closeLoginModal = () => document.getElementById("loginModal").style.display = "none";