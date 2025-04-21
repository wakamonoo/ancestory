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

// Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "ancestory-c068e.firebaseapp.com",
  databaseURL:
    "https://ancestory-c068e-default-rtdb.asia-southeast1.firebasedatabase.app",
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

document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.querySelector('nav ul#sidemenu li a[href="#"]');
  const footerLoginLink = document.getElementById("footerLoginLink");
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

        Swal.fire({
          title: "Success!",
          text: "Story submitted successfully!",
          icon: "success",
          iconColor: "#20462f",
          confirmButtonText: "Awesome!",
          confirmButtonColor: "#FF9A8B",
          background: "#FF6F61",
          color: "#20462f",
          showClass: { popup: "animate__animated animate__fadeInDown" },
          hideClass: { popup: "animate__animated animate__fadeOutUp" },
        }).then(() => {
          closeSubmitStoryModal();
          storyForm.reset();
          window.location.reload();
        });
      } catch (error) {
        console.error("Error submitting story:", error);
        Swal.fire({
          title: "Oops!",
          text: "There was a problem submitting your story.",
          icon: "error",
          iconColor: "#20462f",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#FF9A8B",
          background: "#FF6F61",
          color: "#20462f",
          showClass: { popup: "animate__animated animate__shakeX" },
          hideClass: { popup: "animate__animated animate__fadeOutUp" },
        });
      }
    } else {
      Swal.fire({
        title: "Not Logged In",
        text: "Please log in to submit a story.",
        icon: "warning",
        iconColor: "#20462f",
        confirmButtonText: "OK",
        confirmButtonColor: "#FF9A8B",
        background: "#FF6F61",
        color: "#20462f",
        showClass: { popup: "animate__animated animate__headShake" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" },
      });
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

      if (footerLoginLink) {
        footerLoginLink.textContent = "Logout";
        footerLoginLink.href = "#";
        footerLoginLink.removeEventListener("click", handleLoginClick);
        footerLoginLink.addEventListener("click", handleLogoutClick);
      }

      if (userProfileSection) {
        userProfileSection.style.display = "block";
        const displayNameElement =
          userProfileSection.querySelector(".display-name");
        const photoURLElement =
          userProfileSection.querySelector(".profile-photo");
        if (displayNameElement)
          displayNameElement.textContent = user.displayName || "User";
        if (photoURLElement && user.photoURL)
          photoURLElement.src = user.photoURL;
      }

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

      if (footerLoginLink) {
        footerLoginLink.textContent = "Login";
        footerLoginLink.href = "#";
        footerLoginLink.removeEventListener("click", handleLogoutClick);
        footerLoginLink.addEventListener("click", handleLoginClick);
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
      closeSubmitStoryModal();
    }
  });
});
