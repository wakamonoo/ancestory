import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAy4tekaIpT8doUUP0xA2oHeI9n6JgbybU",
  authDomain: "ancestory-c068e.firebaseapp.com",
  databaseURL: "https://ancestory-c068e-default-rtdb.asia-southeast1.firebasedatabase.app",
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

// ******************** AUTH STATE MANAGEMENT ******************* //
function checkAuthAndPrompt() {
  onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user ? "Logged in" : "Logged out");
    if (user) {
      console.log("User profile:", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }
  });
}

// ******************** EMAIL/PASSWORD AUTH HANDLERS ******************* //
const handleEmailAuth = async (
  isSignup,
  email,
  password,
  displayName,
  confirmPassword
) => {
  try {
    if (isSignup) {
      if (!displayName || displayName.length < 2) {
        throw new Error("Display name must be at least 2 characters");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Set default profile picture
      const photoURL = "images/users.png";

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName,
        photoURL,
      });

      // Create user document
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(
        userRef,
        {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName,
          photoURL,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      return { success: true, user: userCredential.user };
    } else {
      // Handle login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    }
  } catch (error) {
    console.error(`${isSignup ? "Signup" : "Login"} Error:`, error);
    return { success: false, error };
  }
};

// ******************** UI HANDLERS ******************* //
const showAuthError = (isSignup, error) => {
  let errorMessage = error.message;
  const errorCodes = {
    "auth/invalid-email": "Invalid email address",
    "auth/user-disabled": "Account disabled",
    "auth/user-not-found": "Account not found",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "Email already registered",
    "auth/operation-not-allowed": "Operation not allowed",
    "auth/weak-password": "Password must be at least 6 characters",
    "auth/invalid-login-credentials": "Invalid email or password",
  };

  errorMessage = errorCodes[error.code] || errorMessage;

  Swal.fire({
    title: isSignup ? "Signup Error" : "Login Error",
    text: errorMessage,
    icon: "error",
    iconColor: "#20462f",
    confirmButtonText: "OK",
    confirmButtonColor: "#C09779",
    background: "#D29F80",
    color: "#20462f",
    customClass: {
      container: "swal2-container",
    },
    showClass: {
      popup: "animate__animated animate__headShake",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
    backdrop: "rgba(0,0,0,0.7)",
    allowOutsideClick: false,
  });
};

// ******************** FORM HANDLING ******************* //
document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("authForm");
  let isSignup = false;

  // Form mode toggle
  document.getElementById("toggleAuthMode")?.addEventListener("click", (e) => {
    e.preventDefault();
    isSignup = !isSignup;
    document.getElementById("signupFields").style.display = isSignup
      ? "block"
      : "none";
    document.getElementById("modalTitle").textContent = isSignup
      ? "Create Account"
      : "Welcome Back!";
    document.querySelector(".login-btn").textContent = isSignup
      ? "Sign Up"
      : "Login";
    document.getElementById("toggleAuthMode").innerHTML = isSignup
      ? 'Already have an account? <a href="#">Login</a>'
      : 'Need an account? <a href="#">Sign Up</a>';
  });

  // Form submission
  authForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value.trim();
    const confirmPassword = isSignup
      ? document.getElementById("authConfirmPassword").value.trim()
      : null;
    const displayName = isSignup
      ? document.getElementById("authDisplayName").value.trim()
      : null;

    if (!email || !password) {
      return showAuthError(
        isSignup,
        new Error("Please fill in all required fields")
      );
    }

    const { success, error, user } = await handleEmailAuth(
      isSignup,
      email,
      password,
      displayName,
      confirmPassword
    );

    if (success) {
      console.log("Authentication successful:", user);
      window.location.reload();
    } else {
      showAuthError(isSignup, error);
    }
  });

  // ******************** GOOGLE AUTH HANDLER ******************* //
  document
    .getElementById("google-sign-in-btn")
    ?.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider: "google",
            lastLogin: new Date().toISOString(),
          },
          { merge: true }
        );

        window.location.reload();
      } catch (error) {
        console.error("Google sign-in failed:", error);
        showAuthError(false, error);
      }
    });

  // ******************** MODAL CONTROLS ******************* //
  checkAuthAndPrompt();
  document.querySelector(".close")?.addEventListener("click", () => {
    document.getElementById("loginModal").style.display = "none";
  });
});

// ******************** GLOBAL EXPORTS ******************* //
window.openLoginModal = () => {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "block";
    document.getElementById("authForm").reset();
    document.getElementById("signupFields").style.display = "none";
    isSignup = false;
  }
};

window.closeLoginModal = () => {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
};