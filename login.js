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
const facebookAuthProvider = new FacebookAuthProvider();
facebookAuthProvider.addScope("public_profile");

// ******************** LOGIN MODAL AFTER 5S DELAY ******************* //

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

// ******************** LOGIN MODAL TRIGGERS ******************* //

document.addEventListener("DOMContentLoaded", () => {
  const googleSignInBtn = document.getElementById("google-sign-in-btn");
  const facebookSignInBtn = document.getElementById("facebook-sign-in-btn");
  const loginModal = document.getElementById("loginModal");
  const closeBtn = loginModal?.querySelector(".close");

  let isLoginInProgress = false;

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

  // ******************** Google Sign-In ******************* //
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener("click", async () => {
      if (isLoginInProgress) return;
      isLoginInProgress = true;

      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        const user = result.user;

        if (user) {
          console.log("[Google] Profile photo URL:", user.photoURL);
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
      } finally {
        isLoginInProgress = false;
      }
    });
  }

  // ******************** Facebook Sign-In ******************* //
  if (facebookSignInBtn) {
    facebookSignInBtn.addEventListener("click", async () => {
      if (isLoginInProgress) return;
      isLoginInProgress = true;

      try {
        const result = await signInWithPopup(auth, facebookAuthProvider);
        const user = result.user;

        if (user) {
          console.groupCollapsed("[Facebook Debug]");
          console.log("Full user object:", user);
          
          // Get Facebook provider data
          const facebookProviderData = user.providerData.find(
            (provider) => provider.providerId === FacebookAuthProvider.PROVIDER_ID
          );
          console.log("Facebook provider data:", facebookProviderData);

          // Get Facebook UID
          const facebookUID = facebookProviderData?.uid;
          console.log("Facebook UID:", facebookUID || "Not found");

          // Construct photo URL
          let facebookPhotoURL;
          if (facebookUID) {
            facebookPhotoURL = `https://graph.facebook.com/${facebookUID}/picture?type=large`;
            console.log("Constructed Facebook URL:", facebookPhotoURL);
            
            // Test image loading
            const testImage = new Image();
            testImage.onload = () => console.log("Image loads successfully");
            testImage.onerror = (e) => console.error("Image load error:", e);
            testImage.src = facebookPhotoURL;
          } else {
            facebookPhotoURL = "images/user.png";
            console.warn("Using fallback image:", facebookPhotoURL);
            
            // Verify fallback path
            const fallbackTest = new Image();
            fallbackTest.onload = () => console.log("Fallback image exists");
            fallbackTest.onerror = (e) => console.error("Fallback image missing:", e);
            fallbackTest.src = facebookPhotoURL;
          }

          console.groupEnd();

          const userRef = doc(db, "users", user.uid);
          await setDoc(
            userRef,
            {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: facebookPhotoURL,
            },
            { merge: true }
          );

          closeLoginModal();
          window.location.reload();
        }
      } catch (error) {
        console.error("Facebook Sign-in error:", error);
        if (error.code === 'auth/account-exists-with-different-credential') {
          console.error("Email conflict - existing account with different provider");
        }
      } finally {
        isLoginInProgress = false;
      }
    });
  }
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