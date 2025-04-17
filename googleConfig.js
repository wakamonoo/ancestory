import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc, // Add this import
  serverTimestamp, // Add this import
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
  const loginModal = document.getElementById("loginModal");
  const userProfileSection = document.getElementById("user-profile");
  const submitStoryLink = document.querySelector("#stories a.StorySub");
  const submitStoryModal = document.getElementById("submitStoryModal"); // New
  const closeSubmitStoryModalBtn = submitStoryModal?.querySelector(".close"); //New
  const storyForm = document.getElementById("storyForm"); // New

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

  const openSubmitStoryModal = () => {
    if (submitStoryModal) {
      submitStoryModal.style.display = "block";
    }
  };

  const closeSubmitStoryModal = () => {
    if (submitStoryModal) {
      submitStoryModal.style.display = "none";
    }
  };

  // Function to handle the login link click (opens modal)
  const handleLoginClick = (event) => {
    event.preventDefault();
    openLoginModal();
  };

  const handleLogoutClick = (event) => {
    event.preventDefault();
    signOut(auth)
      .then(() => {
        console.log("User signed out");

        window.location.reload();
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleStorySubmit = async (event) => {
    event.preventDefault();
    const origin = document.getElementById("origin").value;
    const title = document.getElementById("title").value;
    const story = document.getElementById("story").value;

    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, "UserStories"), {
          origin: origin,
          title: title,
          story: story,
          timestamp: serverTimestamp(),
          userID: user.uid,
        });
        alert("Story submitted successfully!");
        closeSubmitStoryModal();
        storyForm.reset(); // Clear the form
        window.location.reload();
      } catch (error) {
        console.error("Error submitting story:", error);
        alert("Error submitting story. Please try again.");
      }
    } else {
      console.error("No user logged in when submitting story.");
      alert("Please log in to submit a story.");
    }
  };

  const updateUI = (user) => {
    if (user) {
      console.log("User is logged in:", user);

      // Check if the user is the admin
      if (user.email === "joven.serdanbataller21@gmail.com") {
        window.location.href = "admin.html";
        return; // Exit early since we're redirecting
      }

      // Rest of your existing code for regular users...
      if (loginLink) {
        loginLink.textContent = "Logout";
        loginLink.href = "#";
        loginLink.removeEventListener("click", handleLoginClick);
        loginLink.addEventListener("click", handleLogoutClick);
      }

      if (userProfileSection) {
        userProfileSection.style.display = "block";
        const displayNameElement =
          userProfileSection.querySelector(".display-name");
        const photoURLElement =
          userProfileSection.querySelector(".profile-photo");
        if (displayNameElement) {
          displayNameElement.textContent = user.displayName || "User";
        }
        if (photoURLElement && user.photoURL) {
          photoURLElement.src = user.photoURL;
        }
      }

      // Update "Submit a Story" link
      if (submitStoryLink) {
        submitStoryLink.textContent = "Submit a Story";
        submitStoryLink.href = "#"; // Change to '#' to handle with JS
        submitStoryLink.style.display = "block";
        submitStoryLink.removeEventListener("click", openLoginModal); // Remove old listener
        submitStoryLink.addEventListener("click", (event) => {
          event.preventDefault();
          openSubmitStoryModal(); // Open submit story modal
        });
      }

      if (loginModal && loginModal.style.display === "block") {
        closeLoginModal();
      }
    } else {
      console.log("User is logged out");

      if (loginLink) {
        loginLink.textContent = "Login";
        loginLink.href = "#";
        loginLink.removeEventListener("click", handleLogoutClick);
        loginLink.addEventListener("click", handleLoginClick);
      }

      if (userProfileSection) {
        userProfileSection.style.display = "none";
      }

      // Update "Submit a Story" link
      if (submitStoryLink) {
        submitStoryLink.textContent = "Wanna Submit a Story?";
        submitStoryLink.href = "#stories";
        submitStoryLink.style.display = "block";
        submitStoryLink.removeEventListener("click", (event) => {
          event.preventDefault();
          openSubmitStoryModal();
        });
        submitStoryLink.addEventListener("click", (event) => {
          event.preventDefault();
          openLoginModal(); // Open login modal if not logged in
        });
      }
    }
  };

  onAuthStateChanged(auth, updateUI);

  // Event listeners for the submit story modal
  if (closeSubmitStoryModalBtn) {
    closeSubmitStoryModalBtn.addEventListener("click", closeSubmitStoryModal);
  }

  if (storyForm) {
    storyForm.addEventListener("submit", handleStorySubmit);
  }

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === submitStoryModal) {
      submitStoryModal.style.display = "none";
    }
  });
});