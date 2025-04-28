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

// Debugging flags
const DEBUG_MODE = true;
const FORCE_RELOAD = true;

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Session management
let authFlowInProgress = false;

// Debug logger
function log(message) {
  if (DEBUG_MODE) console.log(`[Auth] ${message}`);
}

// Error handler
function handleAuthError(error) {
  log(`Error: ${error.code} - ${error.message}`);
  sessionStorage.removeItem('authFlow');
  showMessage(error.message, 'error');
}

// UI Feedback
function showMessage(message, type = 'info') {
  const colors = {
    info: '#31708f',
    error: '#a94442',
    success: '#3c763d'
  };
  
  const messageDiv = document.createElement('div');
  messageDiv.style = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px;
    color: white;
    background: ${colors[type]};
    border-radius: 5px;
    z-index: 1000;
    animation: slideIn 0.5s ease-out;
  `;
  
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.style.animation = 'slideOut 0.5s ease-in';
    setTimeout(() => messageDiv.remove(), 500);
  }, 3000);
}

// Handle authentication redirect
async function handleRedirect() {
  try {
    log('Checking for redirect result...');
    const result = await getRedirectResult(auth);
    
    if (result) {
      log('Redirect result found');
      const { user } = result;
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date(),
      }, { merge: true });

      showMessage('Login successful!', 'success');
      
      if (FORCE_RELOAD || isMobile) {
        log('Forcing page reload for mobile');
        window.location.href = window.location.href.split('#')[0];
      }
    }
  } catch (error) {
    handleAuthError(error);
  } finally {
    sessionStorage.removeItem('authFlow');
  }
}

// Authentication state observer
function initAuthState() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      log(`User authenticated: ${user.email}`);
      document.getElementById('loginModal').style.display = 'none';
    } else {
      log('No authenticated user');
      if (!authFlowInProgress) {
        setTimeout(() => {
          if (!user) document.getElementById('loginModal').style.display = 'block';
        }, 5000);
      }
    }
  });
}

// Sign-in handler
async function handleGoogleSignIn() {
  try {
    authFlowInProgress = true;
    sessionStorage.setItem('authFlow', 'google');
    
    if (isMobile) {
      log('Mobile device detected, using full redirect');
      window.location.href = `https://${firebaseConfig.authDomain}/__/auth/handler`;
    } else {
      await signInWithRedirect(auth, googleProvider);
    }
  } catch (error) {
    handleAuthError(error);
    authFlowInProgress = false;
  }
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
  // Configure the Google provider
  googleProvider.setCustomParameters({
    prompt: 'select_account',
    login_hint: 'email'
  });

  // Initialize auth flow
  handleRedirect();
  initAuthState();

  // Event listeners
  document.getElementById('google-sign-in-btn').addEventListener('click', handleGoogleSignIn);
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'none';
  });

  // Cancel auth flow on page hide (for mobile)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      authFlowInProgress = false;
      sessionStorage.removeItem('authFlow');
    }
  });
});

// Global access
window.auth = auth;
window.loginWithGoogle = handleGoogleSignIn;