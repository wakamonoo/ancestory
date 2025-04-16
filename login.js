import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// **REPLACE THESE WITH YOUR ACTUAL FIREBASE PROJECT CONFIGURATION!**
const firebaseConfig = {
  apiKey: "AIzaSyAy4tekaIpT8doUUP0xA2oHeI9n6JgbybU",
  authDomain: "ancestory-c068e.firebaseapp.com",
  databaseURL:
    "https://ancestory-c068e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ancestory-c068e",
  storageBucket: "ancestory-c068e.appspot.com",
  messagingSenderId: "579709470015",
  appId: "1:579709470015:web:adbbc5cba7f4e53f617f8a",
  measurementId: "G-S5SQWC7PEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleAuthProvider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
  const googleSignInBtn = document.getElementById('google-sign-in-btn');
  const loginModal = document.getElementById('loginModal');
  const closeBtn = loginModal.querySelector('.close');

  const openLoginModal = () => {
    if (loginModal) {
      loginModal.style.display = 'block';
    }
  };

  const closeLoginModal = () => {
    if (loginModal) {
      loginModal.style.display = 'none';
    }
  };

  // Attach event listeners to your existing modal triggers
  const loginLink = document.querySelector('nav ul#sidemenu li a[href="#"]');
  if (loginLink) {
    loginLink.addEventListener('click', openLoginModal);
  }
  const loginStorySub = document.querySelector('#stories a.StorySub');
  if (loginStorySub) {
    loginStorySub.addEventListener('click', (event) => {
      event.preventDefault();
      openLoginModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLoginModal);
  }
  window.addEventListener('click', (event) => {
    if (loginModal && event.target === loginModal) {
      closeLoginModal();
    }
  });

  if (googleSignInBtn) {
    console.log('Google Sign-in button element found:', googleSignInBtn); // Debugging line

    googleSignInBtn.addEventListener('click', async () => {
      console.log('Google Sign-in button was definitely clicked!'); // Debugging line

      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log('Google Sign-in successful!', { user, token });

        if (user) {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }, { merge: true });
          console.log('User data stored in Firestore.');
        }

        closeLoginModal(); // Just close the modal after successful login
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error('Google Sign-in error:', { errorCode, errorMessage, email, credential });
        // alert(`Google Sign-in failed: ${errorMessage}`); // Removed the alert
      }
    });
  } else {
    console.error("Error: Google Sign-in button element not found!");
  }
});

// Ensure these functions are globally available (though script.js will handle modal now)
window.openLoginModal = () => {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'block';
  }
};

window.closeLoginModal = () => {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'none';
  }
};