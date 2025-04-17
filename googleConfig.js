import {
  getAuth,
  onAuthStateChanged,
  signOut,
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
  const loginModal = document.getElementById("loginModal");
  const userProfileSection = document.getElementById("user-profile");
  let submitStoryLink = document.querySelector("#stories a.StorySub");
  const submitStoryModal = document.getElementById("submitStoryModal");
  const closeSubmitStoryModalBtn = submitStoryModal?.querySelector(".close");
  const storyForm = document.getElementById("storyForm");

  const openLoginModal = () => {
    if (loginModal) loginModal.style.display = "block";
  };

  const closeLoginModal = () => {
    if (loginModal) loginModal.style.display = "none";
  };

  const openSubmitStoryModal = () => {
    if (submitStoryModal) submitStoryModal.style.display = "block";
  };

  const closeSubmitStoryModal = () => {
    if (submitStoryModal) submitStoryModal.style.display = "none";
  };

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
    const displayName = document.getElementById("displayName").value;

    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, "UserStories"), {
          origin: origin,
          title: title,
          story: story,
          timestamp: serverTimestamp(),
          userID: user.uid,
          userName: displayName || "Anonymous",
        });
        alert("Story submitted successfully!");
        closeSubmitStoryModal();
        storyForm.reset();
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

      if (user.email === "joven.serdanbataller21@gmail.com") {
        window.location.href = "admin.html";
        return;
      }

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

      // Clean and re-attach the submit story link
      if (submitStoryLink) {
        submitStoryLink.textContent = "Submit a Story";
        submitStoryLink.href = "#";
        submitStoryLink.style.display = "block";

        const newSubmitStoryLink = submitStoryLink.cloneNode(true);
        submitStoryLink.parentNode.replaceChild(
          newSubmitStoryLink,
          submitStoryLink
        );
        submitStoryLink = newSubmitStoryLink;

        submitStoryLink.addEventListener("click", (event) => {
          event.preventDefault();
          console.log("✅ Logged-in: Opening story submission modal");
          openSubmitStoryModal();
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

      if (submitStoryLink) {
        submitStoryLink.textContent = "Wanna Submit a Story?";
        submitStoryLink.href = "#";
        submitStoryLink.style.display = "block";

        const newSubmitStoryLink = submitStoryLink.cloneNode(true);
        submitStoryLink.parentNode.replaceChild(
          newSubmitStoryLink,
          submitStoryLink
        );
        submitStoryLink = newSubmitStoryLink;

        submitStoryLink.addEventListener("click", (event) => {
          event.preventDefault();
          console.log("❌ Logged-out: Opening login modal");
          openLoginModal();
        });
      }
    }
  };

  onAuthStateChanged(auth, updateUI);

  if (closeSubmitStoryModalBtn) {
    closeSubmitStoryModalBtn.addEventListener("click", closeSubmitStoryModal);
  }

  if (storyForm) {
    storyForm.addEventListener("submit", handleStorySubmit);
  }

  window.addEventListener("click", (event) => {
    if (event.target === submitStoryModal) {
      submitStoryModal.style.display = "none";
    }
  });
});
