import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
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

document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.querySelector('nav ul#sidemenu li a[href="#"]');
  const footerLoginLink = document.getElementById("footerLoginLink");
  const loginModal = document.getElementById("loginModal");
  const userProfileSection = document.getElementById("user-profile");
  const submitStoryModal = document.getElementById("submitStoryModal");
  const storyForm = document.getElementById("storyForm");

  const openModal = (modal) => {
    if (modal) modal.style.display = "block";
  };

  const closeModal = (modal) => {
    if (modal) modal.style.display = "none";
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    openModal(loginModal);
  };

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      console.log("User signed out");
      updateUI(null); // Update the UI when logged out
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    const origin = document.getElementById("origin").value.trim();
    const title = document.getElementById("title").value.trim();
    const story = document.getElementById("story").value.trim();
    const displayName = document.getElementById("displayName").value.trim();
    const user = auth.currentUser;

    if (!user) {
      return Swal.fire({
        title: "Not Logged In",
        text: "Please log in to submit a story.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }

    try {
      await addDoc(collection(db, "UserStories"), {
        origin,
        title,
        story,
        userID: user.uid,
        userName: displayName || "Anonymous",
        timestamp: serverTimestamp(),
      });

      await Swal.fire({
        title: "Success!",
        text: "Story submitted successfully!",
        icon: "success",
        confirmButtonText: "Awesome!",
      });

      closeModal(submitStoryModal);
      storyForm.reset();
    } catch (err) {
      console.error("Story submission failed:", err);
      Swal.fire({
        title: "Oops!",
        text: "There was a problem submitting your story.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const updateUI = (user) => {
    const isAdmin = user?.email === "joven.serdanbataller21@gmail.com";

    if (user) {
      console.log("✅ Logged in:", user);
      if (isAdmin) {
        window.location.href = "admin.html";
        return;
      }

      const updateLink = (link) => {
        link.textContent = "Logout";
        link.removeEventListener("click", handleLoginClick);
        link.addEventListener("click", handleLogoutClick);
      };

      if (loginLink) updateLink(loginLink);
      if (footerLoginLink) updateLink(footerLoginLink);

      if (userProfileSection) {
        userProfileSection.style.display = "block";
        const nameEl = userProfileSection.querySelector(".display-name");
        const photoEl = userProfileSection.querySelector(".profile-photo");
        if (nameEl) nameEl.textContent = user.displayName || "User";
        if (photoEl && user.photoURL) photoEl.src = user.photoURL;
      }

      if (submitStoryLink) {
        submitStoryLink.textContent = "Submit a Story";
        submitStoryLink.style.display = "block";
      }

      closeModal(loginModal);
    } else {
      console.log("❌ Logged out");

      const revertLink = (link) => {
        link.textContent = "Login";
        link.removeEventListener("click", handleLogoutClick);
        link.addEventListener("click", handleLoginClick);
      };

      if (loginLink) revertLink(loginLink);
      if (footerLoginLink) revertLink(footerLoginLink);

      if (userProfileSection) userProfileSection.style.display = "none";
    }
  };

  // Google Sign In
  const provider = new GoogleAuthProvider();
  const googleSignInButton = document.getElementById("googleSignIn");

  if (googleSignInButton) {
    googleSignInButton.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("User signed in:", user);
        updateUI(user); // Update the UI after successful login
      } catch (err) {
        console.error("Google Sign In Error:", err);
      }
    });
  }

  // Handle Auth State Change
  onAuthStateChanged(auth, updateUI);

  // Story Modal Close Button
  const closeSubmitStoryModalBtn = submitStoryModal.querySelector(".close");
  if (closeSubmitStoryModalBtn) {
    closeSubmitStoryModalBtn.addEventListener("click", () => closeModal(submitStoryModal));
  }

  if (storyForm) {
    storyForm.addEventListener("submit", handleStorySubmit);
  }

  window.addEventListener("click", (e) => {
    if (e.target === submitStoryModal) closeModal(submitStoryModal);
  });
});
