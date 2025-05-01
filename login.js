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

// ******************** AUTH STATE CHECKER ******************* //
function checkAuthAndPrompt() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      setTimeout(() => {
        const modal = document.getElementById("loginModal");
        if (modal) {
          modal.style.display = "block";
          window.addEventListener("click", (event) => {
            if (event.target === modal) {
              modal.style.display = "none";
            }
          });
        }
      }, 5000);
    }
  });
}

// ******************** AUTH MODAL HANDLERS ******************* //
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const googleSignInBtn = document.getElementById("google-sign-in-btn");
  const loginModal = document.getElementById("loginModal");
  const closeBtn = loginModal?.querySelector(".close");
  const authForm = document.getElementById("authForm");
  const toggleAuthMode = document.getElementById("toggleAuthMode");
  const signupFields = document.getElementById("signupFields");
  const modalTitle = document.getElementById("modalTitle");
  let isSignup = false;

  // ******************** EMAIL/PASSWORD AUTH ******************* //
  // Toggle Login/Signup Form
  toggleAuthMode?.addEventListener("click", (e) => {
    e.preventDefault();
    isSignup = !isSignup;
    signupFields.style.display = isSignup ? "block" : "none";
    modalTitle.textContent = isSignup 
      ? "Create AnceStory Account" 
      : "Login to AnceStory";
    toggleAuthMode.innerHTML = isSignup
      ? 'Already have an account? <a href="#">Login here.</a>'
      : 'Don\'t have an account? <a href="#">Sign up here.</a>';
    document.querySelector(".login-btn").textContent = isSignup ? "Sign Up" : "Login";
  });

  // Handle Email/Password Form Submission
  authForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value;
    const password = document.getElementById("authPassword").value;
    const confirmPassword = isSignup ? document.getElementById("authConfirmPassword").value : null;
    const displayName = isSignup ? document.getElementById("authDisplayName").value : null;

    try {
      if (isSignup) {
        // Signup Validation
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        // Create User
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Update Profile
        await updateProfile(userCredential.user, { displayName });

        // Create User Document
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName,
          photoURL: null,
        }, { merge: true });
      } else {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
      }

      closeLoginModal();
      window.location.reload();
    } catch (error) {
      console.error("Authentication Error:", error);
      Swal.fire({
        title: isSignup ? "Signup Error" : "Login Error",
        text: error.message,
        icon: "error",
        iconColor: "#20462f",
        confirmButtonText: "OK",
        confirmButtonColor: "#C09779",
        background: "#D29F80",
        color: "#20462f",
        showClass: { popup: "animate__animated animate__headShake" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" },
      });
    }
  });

  // ******************** GOOGLE AUTH ******************* //
  googleSignInBtn?.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          { merge: true }
        );

        closeLoginModal();
        window.location.reload();
      }
    } catch (error) {
      console.error("Google Sign-in error:", error);
      Swal.fire({
        title: "Google Sign-in Failed",
        text: error.message,
        icon: "error",
        iconColor: "#20462f",
        confirmButtonText: "OK",
        confirmButtonColor: "#C09779",
        background: "#D29F80",
        color: "#20462f",
        showClass: { popup: "animate__animated animate__headShake" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" },
      });
    }
  });

  // ******************** MODAL CONTROLS ******************* //
  checkAuthAndPrompt();

  const openLoginModal = () => {
    if (loginModal) {
      loginModal.style.display = "block";
      // Reset form state when opening modal
      isSignup = false;
      signupFields.style.display = "none";
      modalTitle.textContent = "Login to AnceStory";
      toggleAuthMode.innerHTML = 'Don\'t have an account? <a href="#">Sign up here.</a>';
      document.querySelector(".login-btn").textContent = "Login";
    }
  };

  const closeLoginModal = () => {
    if (loginModal) loginModal.style.display = "none";
  };

  // Login Link Handlers
  document.querySelectorAll("[data-login-trigger]").forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openLoginModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLoginModal);
});

// ******************** GLOBAL FUNCTIONS ******************* //
window.openLoginModal = () => {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "block";
};

window.closeLoginModal = () => {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
};