import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Check auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      loadUserProfile();
      loadUserComments();
      loadUserReactions();
    } else {
      // Redirect to login if not authenticated
      window.location.href = "login.html";
    }
  });

  // Back button
  const backButton = document.querySelector(".back-button");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.history.back();
    });
  }

  // Tab switching
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const tabId = tab.dataset.tab;
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });
      const targetTab = document.getElementById(`${tabId}Tab`);
      if (targetTab) {
        targetTab.classList.add("active");
      }
    });
  });

  // Account deletion
  const deleteAccountBtn = document.getElementById("deleteAccountBtn");
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", scheduleAccountDeletion);
  }
});

async function loadUserProfile() {
  if (!currentUser) return;
  const userDoc = await getDoc(doc(db, "users", currentUser.uid));

  // Set display name
  const displayName =
    currentUser.displayName || userDoc.data()?.displayName || "User";
  const userNameDisplay = document.getElementById("userNameDisplay");
  if (userNameDisplay) {
    userNameDisplay.textContent = displayName;
  }

  // Set profile picture
  const photoURL = currentUser.photoURL || userDoc.data()?.photoURL;
  const profilePicture = document.getElementById("profilePicture");
  if (profilePicture) {
    if (photoURL) {
      profilePicture.src = photoURL;
    } else {
      profilePicture.src = "https://via.placeholder.com/150";
    }
  }
}

async function loadUserComments() {
  if (!currentUser) return;
  const commentsRef = collection(db, "comments");
  const q = query(
    commentsRef,
    where("userId", "==", currentUser.uid),
    orderBy("timestamp", "desc")
  );

  const querySnapshot = await getDocs(q);
  const commentsContainer = document.getElementById("userComments");
  if (!commentsContainer) return;
  commentsContainer.innerHTML = "";

  if (querySnapshot.empty) {
    commentsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-comment-slash"></i>
        <p>You haven't commented on any stories yet.</p>
      </div>
    `;
    return;
  }

  // Group comments by story
  const commentsByStory = {};
  querySnapshot.forEach((doc) => {
    const comment = doc.data();
    if (!commentsByStory[comment.storyId]) {
      commentsByStory[comment.storyId] = [];
    }
    commentsByStory[comment.storyId].push(comment);
  });

  // Fetch story details for each commented story
  for (const storyId in commentsByStory) {
    const storyDoc = await getDoc(doc(db, "Stories", storyId));
    if (storyDoc.exists()) {
      const story = storyDoc.data();

      const storyEl = document.createElement("div");
      storyEl.className = "userCard";

      let storyImageHtml = "";
      if (story.images) {
        storyImageHtml = `<img src="${story.images}" alt="${story.title}" class="story-image">`;
      }

      const commentsHtml = commentsByStory[storyId]
        .map(
          (comment) => `
        <div class="comment-card">
          <div class="comment-content">${comment.text}</div>
          <div class="comment-time">${formatTime(
            comment.timestamp?.toDate()
          )}</div>
        </div>
      `
        )
        .join("");

      storyEl.innerHTML = `
        <div class="story-header">
          <h3><a href="storyDetail.html?storyId=${storyId}">${
        story.title
      }</a></h3>
          <p class="story-origin">${story.origin || "Unknown origin"}</p>
          ${storyImageHtml}
        </div>
        <div class="story-comments">${commentsHtml}</div>
      `;

      commentsContainer.appendChild(storyEl);
    }
  }
}

async function loadUserReactions() {
  if (!currentUser) return;
  const reactionsRef = collection(db, "reactions");
  const q = query(
    reactionsRef,
    where("userId", "==", currentUser.uid),
    orderBy("timestamp", "desc")
  );

  const querySnapshot = await getDocs(q);
  const reactionsContainer = document.getElementById("userReactions");
  if (!reactionsContainer) return;
  reactionsContainer.innerHTML = "";

  if (querySnapshot.empty) {
    reactionsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-heart-broken"></i>
        <p>You haven't reacted to any stories yet.</p>
      </div>
    `;
    return;
  }

  // Group reactions by story
  const reactionsByStory = {};
  querySnapshot.forEach((doc) => {
    const reaction = doc.data();
    if (!reactionsByStory[reaction.storyId]) {
      reactionsByStory[reaction.storyId] = [];
    }
    reactionsByStory[reaction.storyId].push(reaction);
  });

  // Fetch story details for each reacted story
  for (const storyId in reactionsByStory) {
    const storyDoc = await getDoc(doc(db, "Stories", storyId));
    if (storyDoc.exists()) {
      const story = storyDoc.data();

      const storyEl = document.createElement("div");
      storyEl.className = "userCard";

      let storyImageHtml = "";
      if (story.images) {
        storyImageHtml = `<img src="${story.images}" alt="${story.title}" class="story-image">`;
      }

      const reactionsHtml = reactionsByStory[storyId]
        .map(
          (reaction) => `
        <div class="reaction-card">
          <i class="${getReactionIconClass(reaction.reactionType)}"></i>
          <div class="reaction-time">${formatTime(
            reaction.timestamp?.toDate()
          )}</div>
        </div>
      `
        )
        .join("");

      storyEl.innerHTML = `
        <div class="story-header">
          <h3><a href="storyDetail.html?storyId=${storyId}">${
        story.title
      }</a></h3>
          <p class="story-origin">${story.origin || "Unknown origin"}</p>
          ${storyImageHtml}
        </div>
        <div class="story-reactions">${reactionsHtml}</div>
      `;

      reactionsContainer.appendChild(storyEl);
    }
  }
}

function getReactionIconClass(reactionType) {
  switch (reactionType) {
    case "like":
      return "fas fa-thumbs-up reaction-like";
    case "love":
      return "fas fa-heart reaction-love";
    case "wow":
      return "fas fa-surprise reaction-wow";
    case "angry":
      return "fas fa-angry reaction-angry";
    default:
      return "fas fa-question";
  }
}

function formatTime(date) {
  if (!date) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function scheduleAccountDeletion() {
  try {
    const result = await Swal.fire({
      title: "Delete Your Account?",
      html: `
        <p>Your account will be scheduled for deletion in 15 days.</p>
        <p>During this time, you can cancel the deletion by logging in.</p>
        <p>After 15 days, all your data will be permanently removed.</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6F61",
      cancelButtonColor: "#20462f",
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",
      background: "#FF6F61",
      color: "#20462f",
    });

    if (result.isConfirmed) {
      // Calculate deletion date (15 days from now)
      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 15);

      // Mark account for deletion
      if (currentUser && currentUser.uid) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          scheduledForDeletion: true,
          deletionDate: deletionDate.toISOString(),
          lastUpdated: serverTimestamp(),
        });

        // Sign out the user
        await auth.signOut();

        // Show success message
        await Swal.fire({
          title: "Account Deletion Scheduled",
          html: `
            <p>Your account has been scheduled for deletion on ${deletionDate.toLocaleDateString()}.</p>
            <p>You can cancel this by logging in before that date.</p>
          `,
          icon: "success",
          confirmButtonText: "Okay",
          background: "#FF6F61",
          color: "#20462f",
        });

        // Redirect to home page
        window.location.href = "index.html";
      }
    }
  } catch (error) {
    console.error("Error scheduling account deletion:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to schedule account deletion. Please try again.",
      icon: "error",
      confirmButtonText: "Okay",
      background: "#FF6F61",
      color: "#20462f",
    });
  }
}
