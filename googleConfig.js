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

// ******************** LINKS/BUTTONS REDIRECTION ******************* //

document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.querySelector('nav ul#sidemenu li a[href="#"]');
  const footerLoginLink = document.getElementById("footerLoginLink");
  const loginModal = document.getElementById("loginModal");
  const userProfileSection = document.getElementById("user-profile");
  let submitStoryLink = document.querySelector("#stories a.StorySub");
  const submitStoryModal = document.getElementById("submitStoryModal");
  const closeSubmitStoryModalBtn = submitStoryModal?.querySelector(".close");
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
      window.location.reload();
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
        iconColor: "#20462f",
        confirmButtonText: "OK",
        confirmButtonColor: "#C09779",
        background: "#D29F80",
        color: "#20462f",
        showClass: { popup: "animate__animated animate__headShake" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" },
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

      closeModal(submitStoryModal);
      storyForm.reset();

      await Swal.fire({
        title: "Success!",
        text: "Story submitted successfully!",
        icon: "success",
        iconColor: "#20462f",
        confirmButtonText: "Awesome!",
        confirmButtonColor: "#C09779",
        background: "#D29F80",
        color: "#20462f",
        showClass: { popup: "animate__animated animate__fadeInDown" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" },
      });

      window.location.reload();
    } catch (err) {
      console.error("Story submission failed:", err);
      Swal.fire({
        title: "Oops!",
        text: "There was a problem submitting your story.",
        icon: "error",
        iconColor: "#20462f",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#C09779",
        background: "#D29F80",
        color: "#20462f",
        showClass: { popup: "animate__animated animate__shakeX" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" },
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
        link.href = "#";
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

        if (photoEl) {
          // Check if user logged in with email/password
          const isEmailUser = user.providerData.some(
            (provider) => provider.providerId === "password"
          );

          // Use default image for email users, otherwise use provider's image
          photoEl.src = isEmailUser
            ? "images/email-user.png"
            : user.photoURL || "images/email-user.png";
        }
      }

      if (submitStoryLink) {
        submitStoryLink.textContent = "Submit a Story";
        submitStoryLink.href = "#";
        submitStoryLink.style.display = "block";

        const newLink = submitStoryLink.cloneNode(true);
        submitStoryLink.parentNode.replaceChild(newLink, submitStoryLink);
        submitStoryLink = newLink;

        submitStoryLink.addEventListener("click", (e) => {
          e.preventDefault();
          openModal(submitStoryModal);
        });
      }

      if (loginModal?.style.display === "block") closeModal(loginModal);

      document.querySelectorAll(".userAccount").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = "account.html";
        });
      });
    } else {
      console.log("❌ Logged out");

      const revertLink = (link) => {
        link.textContent = "Login";
        link.href = "#";
        link.removeEventListener("click", handleLogoutClick);
        link.addEventListener("click", handleLoginClick);
      };

      if (loginLink) revertLink(loginLink);
      if (footerLoginLink) revertLink(footerLoginLink);

      if (userProfileSection) userProfileSection.style.display = "none";

      if (submitStoryLink) {
        submitStoryLink.textContent = "Wanna Submit a Story?";
        submitStoryLink.href = "#";
        submitStoryLink.style.display = "block";

        const newLink = submitStoryLink.cloneNode(true);
        submitStoryLink.parentNode.replaceChild(newLink, submitStoryLink);
        submitStoryLink = newLink;

        submitStoryLink.addEventListener("click", (e) => {
          e.preventDefault();
          openModal(loginModal);
        });
      }

      document.querySelectorAll(".userAccount").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          openModal(loginModal);
        });
      });
    }
  };

  onAuthStateChanged(auth, (user) => {
    updateUI(user);

    if (submitStoryLink) {
      submitStoryLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (user) {
          openModal(submitStoryModal);
        } else {
          openModal(loginModal);
        }
      });
    }
  });

  if (closeSubmitStoryModalBtn) {
    closeSubmitStoryModalBtn.addEventListener("click", () =>
      closeModal(submitStoryModal)
    );
  }

  if (storyForm) {
    storyForm.addEventListener("submit", handleStorySubmit);
  }

  window.addEventListener("click", (e) => {
    if (e.target === submitStoryModal) closeModal(submitStoryModal);
  });
});
