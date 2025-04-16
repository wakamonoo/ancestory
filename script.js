// Change the nav background color based on scroll position
window.addEventListener('scroll', function() {
  const nav = document.querySelector('nav');

  if (window.scrollY >= window.innerHeight) {
    nav.style.backgroundColor = '#F1D1B5';
  } else {
    nav.style.backgroundColor = '#ff6f61';
  }
});

let currentIndex = 0;
const carousel = document.getElementById("carousel");
const buttons = document.querySelectorAll(".buttons button");

// Update the carousel position and active button
function updateCarousel() {
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  buttons.forEach((btn, index) => {
    btn.classList.toggle("active", index === currentIndex);
  });
}

// Navigate to a specific slide in the carousel
function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

// Move to the next slide in the carousel
function nextSlide() {
  currentIndex = (currentIndex + 1) % 3;
  updateCarousel();
}

// Automatically advance to the next slide every 3 seconds
setInterval(nextSlide, 3000);

// Open the side menu and toggle the menu icon
function openmenu() {
  document.getElementById("sidemenu").style.right = "0";
  document.querySelector(".fa-bars").style.display = "none";
  document.querySelector(".fa-times").style.display = "block";
}

// Close the side menu and toggle the menu icon
function closemenu() {
  document.getElementById("sidemenu").style.right = "-200px";
  document.querySelector(".fa-bars").style.display = "block";
  document.querySelector(".fa-times").style.display = "none";
}

// Manual swipe support for carousel on touch devices
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchStartX - touchEndX > 50) {
    nextSlide();
  } else if (touchEndX - touchStartX > 50) {
    currentIndex = (currentIndex - 1 + 3) % 3;
    updateCarousel();
  }
});

//login
function openLoginModal() {
  document.getElementById("loginModal").style.display = "block";
}
function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}
document
  .getElementById("login-link")
  .addEventListener("click", function (event) {
    event.preventDefault();
    openLoginModal();
  });

  // Firebase Authentication Logic (moved here)
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';

// **REPLACE WITH YOUR ACTUAL FIREBASE CONFIGURATION!**
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.querySelector('nav ul#sidemenu li a[href="#"]');
  const loginModal = document.getElementById('loginModal');
  const userProfileSection = document.getElementById('user-profile');
  const submitStoryLink = document.querySelector('#stories a.StorySub');

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

  // Initial setup for the login link
  if (loginLink) {
    loginLink.addEventListener('click', openLoginModal);
  }

  window.openLoginModal = openLoginModal; // Make it globally available if needed by HTML
  window.closeLoginModal = closeLoginModal; // Make it globally available if needed by HTML

  const updateUI = (user) => {
    if (user) {
      // User is logged in
      console.log('User is logged in:', user);

      // Update navigation link to "Logout"
      if (loginLink) {
        loginLink.textContent = 'Logout';
        loginLink.href = '#';
        loginLink.removeEventListener('click', openLoginModal); // Remove login listener
        loginLink.addEventListener('click', logoutUser); // Add logout listener
      }

      // Show user profile section
      if (userProfileSection) {
        userProfileSection.style.display = 'block';
        const displayNameElement = userProfileSection.querySelector('.display-name');
        const photoURLElement = userProfileSection.querySelector('.profile-photo');
        if (displayNameElement) {
          displayNameElement.textContent = user.displayName || 'User';
        }
        if (photoURLElement && user.photoURL) {
          photoURLElement.src = user.photoURL;
        }
      }

      // Update "Submit a Story" link
      if (submitStoryLink) {
        submitStoryLink.textContent = 'Submit a Story';
        submitStoryLink.href = 'submit-story.html'; // Adjust the link as needed
        submitStoryLink.style.display = 'block'; // Make sure it's visible
      }

      // Optionally hide the login modal if it's still open
      if (loginModal && loginModal.style.display === 'block') {
        closeLoginModal();
      }
    } else {
      // User is logged out
      console.log('User is logged out');

      // Update navigation link to "Login"
      if (loginLink) {
        loginLink.textContent = 'Login';
        loginLink.href = '#';
        loginLink.removeEventListener('click', logoutUser); // Remove logout listener
        loginLink.addEventListener('click', openLoginModal); // Add login listener
      }

      // Hide user profile section
      if (userProfileSection) {
        userProfileSection.style.display = 'none';
      }

      // Update "Submit a Story" link
      if (submitStoryLink) {
        submitStoryLink.textContent = 'Wanna Submit a Story?';
        submitStoryLink.href = '#stories'; // Revert to the non-logged-in behavior
        submitStoryLink.style.display = 'block'; // Make sure it's visible
      }
    }
  };

  const logoutUser = () => {
    signOut(auth).then(() => {
      console.log('User signed out');
      // updateUI will be called automatically by onAuthStateChanged
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  onAuthStateChanged(auth, updateUI);
});