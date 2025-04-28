import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ******************** FIREBASE CONFIG ******************* //

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

// ******************** FUNCTIONS ******************* //

// Check auth and show login modal if not logged in
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
      }, 5000); // 5 seconds delay
    }
  });
}

// Save user info to Firestore
async function saveUserInfo(user) {
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
  }
}

// Open login modal
window.openLoginModal = () => {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "block";
  }
};

// Close login modal
window.closeLoginModal = () => {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "none";
  }
};

// ******************** MAIN LOGIC ******************* //

document.addEventListener("DOMContentLoaded", async () => {
  const googleSignInBtn = document.getElementById("google-sign-in-btn");
  const loginModal = document.getElementById("loginModal");
  const closeBtn = loginModal?.querySelector(".close");

  checkAuthAndPrompt();

  const openLoginModal = () => {
    if (loginModal) {
      loginModal.style.display = "block";
    }
  };

  const closeLoginModal = () => {
    if (loginModal) {
      loginModal.style.display = "none";
    }
  };

  const loginLinkModalTrigger = document.querySelector(
    'nav ul#sidemenu li a[href="#"]'
  );
  if (loginLinkModalTrigger) {
    loginLinkModalTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      openLoginModal();
    });
  }

  const loginStorySub = document.querySelector("#stories a.StorySub");
  if (loginStorySub) {
    loginStorySub.addEventListener("click", (event) => {
      event.preventDefault();
      openLoginModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLoginModal);
  }

  if (googleSignInBtn) {
    googleSignInBtn.addEventListener("click", async () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      try {
        if (isMobile) {
          await signInWithRedirect(auth, googleAuthProvider);
        } else {
          const result = await signInWithPopup(auth, googleAuthProvider);
          const user = result.user;

          await saveUserInfo(user);

          closeLoginModal();
          window.location.reload();
        }
      } catch (error) {
        console.error("Google Sign-in error:", error);
      }
    });
  }

  // Handle redirect result (if user came back from Google login)
  try {
    const redirectResult = await getRedirectResult(auth);
    if (redirectResult) {
      const user = redirectResult.user;
      if (user) {
        await saveUserInfo(user);

        closeLoginModal();
        window.location.reload();
      }
    }
  } catch (error) {
    console.error("Google Redirect Sign-in error:", error);
  }
});
