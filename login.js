import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
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
const VERIFICATION_TIMEOUT = 180000; 

// ******************** AUTH STATE MANAGEMENT ******************* //
function checkAuthAndPrompt() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const signupTime = userDoc.data()?.signupTime;
      
      if (!user.emailVerified) {
        if (signupTime && Date.now() - signupTime > VERIFICATION_TIMEOUT) {
          await deleteUnverifiedUser(user);
          return;
        }
        
        showVerificationReminder(user.email);
        await auth.signOut();
      }
    } else {
      setTimeout(() => {
        const modal = document.getElementById("loginModal");
        if (modal) {
          modal.style.display = "block";
          window.addEventListener("click", (event) => {
            if (event.target === modal) modal.style.display = "none";
          });
        }
      }, 5000);
    }
  });
}

// ******************** USER MANAGEMENT ******************* //
const deleteUnverifiedUser = async (user) => {
  try {
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
    showAuthError(false, new Error('Verification window expired. Account deleted.'));
  } catch (error) {
    console.error('Error deleting unverified user:', error);
  }
};

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
      if (!displayName || displayName.length < 2) throw new Error("Display name must be at least 2 characters");
      if (password !== confirmPassword) throw new Error("Passwords do not match");
      if (password.length < 6) throw new Error("Password must be at least 6 characters");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const photoURL = "images/users.png";
      
      await updateProfile(userCredential.user, { displayName, photoURL });
      const userRef = doc(db, "users", userCredential.user.uid);
      
      await setDoc(userRef, {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName,
        photoURL,
        signupTime: Date.now(),
        emailVerified: false,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      await sendEmailVerification(userCredential.user);
      await auth.signOut();

      return { success: true, needsVerification: true };
    } else {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const signupTime = userDoc.data()?.signupTime;

      if (!userCredential.user.emailVerified) {
        if (Date.now() - signupTime > VERIFICATION_TIMEOUT) {
          await deleteUnverifiedUser(userCredential.user);
          throw new Error('Verification window expired');
        }
        await auth.signOut();
        throw new Error("auth/email-not-verified");
      }

      return { success: true, user: userCredential.user };
    }
  } catch (error) {
    return { success: false, error };
  }
};

// ******************** UI HANDLERS ******************* //
const showVerificationReminder = (email) => {
  Swal.fire({
    title: 'Verify Your Email',
    html: `We've sent a verification email to <b>${email}</b>. 
          You have 3 minutes to verify your account.<br><br>
          <a href="#" onclick="resendVerification()">Resend Email</a>`,
    icon: 'warning',
    confirmButtonText: 'OK',
    confirmButtonColor: '#C09779',
    background: '#D29F80',
    color: '#20462f',
    allowOutsideClick: false
  });
};

const showAuthError = (isSignup, error) => {
  const errorCodes = {
    "auth/email-not-verified": "Verify your email first",
    "auth/verification-expired": "Verification window expired. Sign up again",
    "auth/invalid-email": "Invalid email address",
    "auth/user-disabled": "Account disabled",
    "auth/user-not-found": "Account not found",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "Email already registered",
    "auth/operation-not-allowed": "Operation not allowed",
    "auth/weak-password": "Password must be at least 6 characters",
    "auth/invalid-login-credentials": "Invalid email or password",
    "auth/too-many-requests": "Too many attempts. Try again later or reset password",
  };

  const errorMessage = errorCodes[error.code] || error.message;

  Swal.fire({
    title: isSignup ? "Signup Error" : "Login Error",
    text: errorMessage,
    icon: "error",
    iconColor: "#20462f",
    confirmButtonText: "OK",
    confirmButtonColor: "#C09779",
    background: "#D29F80",
    color: "#20462f",
    customClass: { container: "swal2-container" },
    showClass: { popup: "animate__animated animate__headShake" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" },
    backdrop: "rgba(0,0,0,0.7)",
    allowOutsideClick: false,
  });
};

// ******************** FORM HANDLING ******************* //
document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("authForm");
  let isSignup = false;

  document.getElementById("toggleAuthMode")?.addEventListener("click", (e) => {
    e.preventDefault();
    isSignup = !isSignup;
    document.getElementById("signupFields").style.display = isSignup ? "block" : "none";
    document.getElementById("modalTitle").textContent = isSignup ? "Create Account" : "Welcome Back!";
    document.querySelector(".login-btn").textContent = isSignup ? "Sign Up" : "Login";
    document.getElementById("toggleAuthMode").innerHTML = isSignup 
      ? 'Already have an account? <a href="#">Login</a>' 
      : 'Need an account? <a href="#">Sign Up</a>';
  });

  authForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value.trim();
    const confirmPassword = isSignup ? document.getElementById("authConfirmPassword").value.trim() : null;
    const displayName = isSignup ? document.getElementById("authDisplayName").value.trim() : null;

    if (!email || !password) return showAuthError(isSignup, new Error("Please fill in all required fields"));

    const { success, error, user } = await handleEmailAuth(isSignup, email, password, displayName, confirmPassword);

    if (success) {
      if (isSignup) {
        Swal.fire({
          title: 'Verify Your Email!',
          html: `We've sent a verification link to <b>${email}</b>. Please check your inbox.`,
          icon: 'success',
          confirmButtonColor: '#C09779',
          background: '#D29F80',
          color: '#20462f',
        });
        closeLoginModal();
      } else {
        window.location.reload();
      }
    } else {
      showAuthError(isSignup, error);
    }
  });

  // ******************** Google-Sigin ******************* //
  document.getElementById("google-sign-in-btn")?.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: "google",
        lastLogin: new Date().toISOString(),
        emailVerified: user.emailVerified,
      }, { merge: true });

      closeLoginModal();
      window.location.reload();
    } catch (error) {
      console.error("Google sign-in failed:", error);
      showAuthError(false, error);
    }
  });

  // ******************** Modal Triggers ******************* //
  const loginLinkModalTrigger = document.querySelector('nav ul#sidemenu li a[href="#"]');
  const loginStorySub = document.querySelector("#stories a.StorySub");

  if (loginLinkModalTrigger) {
    loginLinkModalTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      openLoginModal();
    });
  }

  if (loginStorySub) {
    loginStorySub.addEventListener("click", (event) => {
      event.preventDefault();
      openLoginModal();
    });
  }

  document.querySelector(".close")?.addEventListener("click", closeLoginModal);
  checkAuthAndPrompt();
});

// ******************** GLOBAL FUNCTIONS ******************* //
window.checkVerifiedUser = () => {
  const user = auth.currentUser;
  if (!user?.emailVerified) {
    Swal.fire({
      title: 'Verification Required',
      text: 'You must verify your email to perform this action',
      icon: 'warning',
      confirmButtonColor: '#C09779',
      background: '#D29F80',
      color: '#20462f',
    });
    return false;
  }
  return true;
};

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