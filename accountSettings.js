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
  deleteDoc,
  serverTimestamp,
  orderBy,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
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
    deleteAccountBtn.addEventListener("click", handleAccountDeletion);
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
    commentsByStory[comment.storyId].push({ id: doc.id, ...comment });
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
        storyImageHtml = `<img src="${story.images}" alt="${story.title}" class="storyImageuser">`;
      }

      const commentsHtml = commentsByStory[storyId]
        .map(
          (comment) => `
        <div class="comment-card">
          <div class="comment-contentUser">${comment.text}</div>
          <div class="comment-actions">
            <button class="delete-comment-btn" data-comment-id="${comment.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <div class="comment-timeUser">${formatTime(
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
          <p class="story-originUser">${story.origin || "Unknown origin"}</p>
          ${storyImageHtml}
        </div>
        <div class="story-comments">${commentsHtml}</div>
      `;

      commentsContainer.appendChild(storyEl);
    }
  }

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-commentAcc').forEach(button => {
    button.addEventListener('click', async (e) => {
      const commentId = e.currentTarget.dataset.commentId;
      await deleteComment(commentId);
    });
  });
}

async function deleteComment(commentId) {
  try {
    const result = await Swal.fire({
      title: 'Delete Comment?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4757',
      cancelButtonColor: '#20462f',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "comments", commentId));
      Swal.fire(
        'Deleted!',
        'Your comment has been deleted.',
        'success'
      );
      // Refresh comments
      loadUserComments();
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    Swal.fire(
      'Error!',
      'Failed to delete comment.',
      'error'
    );
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
    reactionsByStory[reaction.storyId].push({ id: doc.id, ...reaction });
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
        storyImageHtml = `<img src="${story.images}" alt="${story.title}" class="storyImageuser">`;
      }

      const reactionsHtml = reactionsByStory[storyId]
        .map(
          (reaction) => `
        <div class="reaction-card">
          <i class="${getReactionIconClass(reaction.reactionType)}"></i>
          <div class="reaction-actions">
            <button class="delete-reaction-btn" data-reaction-id="${reaction.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <div class="reaction-timeUser">${formatTime(
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
          <p class="story-originUser">${story.origin || "Unknown origin"}</p>
          ${storyImageHtml}
        </div>
        <div class="story-reactions">${reactionsHtml}</div>
      `;

      reactionsContainer.appendChild(storyEl);
    }
  }

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-reactionAcc').forEach(button => {
    button.addEventListener('click', async (e) => {
      const reactionId = e.currentTarget.dataset.reactionId;
      await deleteReaction(reactionId);
    });
  });
}

async function deleteReaction(reactionId) {
  try {
    const result = await Swal.fire({
      title: 'Remove Reaction?',
      text: "This will remove your reaction from the story.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4757',
      cancelButtonColor: '#20462f',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "reactions", reactionId));
      Swal.fire(
        'Removed!',
        'Your reaction has been removed.',
        'success'
      );
      // Refresh reactions
      loadUserReactions();
    }
  } catch (error) {
    console.error("Error deleting reaction:", error);
    Swal.fire(
      'Error!',
      'Failed to remove reaction.',
      'error'
    );
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

async function handleAccountDeletion() {
  try {
    // First confirmation
    const firstConfirm = await Swal.fire({
      title: "Delete Your Account?",
      html: `
        <div class="animate__animated animate__headShake animate__slow">
          <i class="fas fa-heart-crack" style="font-size: 3rem; color: #ff4757;"></i>
          <p>This will permanently erase your account and all associated data!</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4757",
      cancelButtonColor: "#20462f",
      confirmButtonText: "Continue to deletion",
      cancelButtonText: "Cancel",
      background: "#FF6F61",
      color: "#20462f",
    });

    if (!firstConfirm.isConfirmed) return;

    // Check if user is Google-authenticated
    const isGoogleUser = currentUser.providerData.some(
      (provider) => provider.providerId === "google.com"
    );

    if (isGoogleUser) {
      // Handle Google users differently - no password needed
      const googleConfirm = await Swal.fire({
        title: "Google Account Detected",
        html: `
          <div class="animate__animated animate__pulse">
            <i class="fab fa-google" style="font-size: 3rem; color: #4285F4;"></i>
            <p>You signed in with Google. We'll need you to sign in again to confirm deletion.</p>
          </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#ff4757",
        cancelButtonColor: "#20462f",
        confirmButtonText: "Continue with Google",
        cancelButtonText: "Cancel",
        background: "#FF6F61",
        color: "#20462f",
      });

      if (!googleConfirm.isConfirmed) return;

      // Show processing
      Swal.fire({
        title: "Preparing Account Deletion",
        html: `
          <div class="animate__animated animate__pulse animate__infinite">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>
            <p>Preparing to delete your account...</p>
          </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        background: "#FF6F61",
        color: "#20462f"
      });

      // For Google users, we'll proceed directly to deletion
      // since they've already confirmed by signing in again
    } else {
      // Handle email/password users (original flow)
      const { value: password } = await Swal.fire({
        title: "Enter Your Password",
        input: "password",
        inputLabel: "For security, please enter your password to confirm deletion",
        inputPlaceholder: "Enter your password",
        showCancelButton: true,
        confirmButtonColor: "#ff4757",
        cancelButtonColor: "#20462f",
        inputValidator: (value) => {
          if (!value) {
            return "You need to enter your password!";
          }
        },
        background: "#FF6F61",
        color: "#20462f",
      });

      if (!password) return;

      // Show processing
      Swal.fire({
        title: "Verifying...",
        html: `
          <div class="animate__animated animate__pulse animate__infinite">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>
            <p>Verifying your credentials...</p>
          </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        background: "#FF6F61",
        color: "#20462f"
      });

      // Reauthenticate email/password users
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
    }

    // Final confirmation for all users
    const finalConfirm = await Swal.fire({
      title: "Last Chance to Change Your Mind",
      html: `
        <div class="animate__animated animate__wobble animate__slow">
          <i class="fas fa-skull-crossbones" style="font-size: 3rem;"></i>
          <p>This will permanently delete all your data!</p>
        </div>
        <p class="animate__animated animate__fadeIn">This action cannot be undone.</p>
      `,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ff0000",
      cancelButtonColor: "#20462f",
      confirmButtonText: "DELETE EVERYTHING NOW",
      cancelButtonText: "Cancel",
      background: "#FF6F61",
      color: "#20462f",
    });

    if (!finalConfirm.isConfirmed) return;

    // Show deletion in progress
    Swal.fire({
      title: "Deleting Your Account",
      html: `
        <div class="animate__animated animate__pulse animate__infinite">
          <i class="fas fa-trash fa-spin" style="font-size: 2rem;"></i>
          <p>Removing all your data...</p>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      background: "#FF6F61",
      color: "#20462f"
    });

    // First delete all user data
    await deleteUserData(currentUser.uid);

    // Then delete the auth user
    await deleteUser(currentUser);

    // Show success message
    await Swal.fire({
      title: "Account Deleted",
      html: `
        <div class="animate__animated animate__fadeOutUp animate__slow">
          <i class="fas fa-sad-cry" style="font-size: 3rem;"></i>
          <p>Your account has been permanently deleted.</p>
        </div>
      `,
      confirmButtonText: "Goodbye",
      background: "#FF6F61",
      color: "#20462f",
    });

    // Redirect to home page
    window.location.href = "index.html";

  } catch (error) {
    console.error("Error deleting account:", error);
    Swal.fire({
      title: "Deletion Failed",
      html: `
        <div class="animate__animated animate__shakeX">
          <i class="fas fa-exclamation-triangle"></i>
          <p>${error.message || "Something went wrong!"}</p>
        </div>
        <p>Please try again later.</p>
      `,
      icon: "error",
      confirmButtonText: "Okay",
      background: "#FF6F61",
      color: "#20462f"
    });
  }
}

async function deleteUserData(userId) {
  const batch = writeBatch(db);

  try {
    // Delete user document
    const userDocRef = doc(db, "users", userId);
    batch.delete(userDocRef);

    // Delete all user comments
    const commentsQuery = query(collection(db, "comments"), where("userId", "==", userId));
    const commentsSnapshot = await getDocs(commentsQuery);
    commentsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete all user reactions
    const reactionsQuery = query(collection(db, "reactions"), where("userId", "==", userId));
    const reactionsSnapshot = await getDocs(reactionsQuery);
    reactionsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete user stories if you have a UserStories collection
    const storiesQuery = query(collection(db, "UserStories"), where("userID", "==", userId));
    const storiesSnapshot = await getDocs(storiesQuery);
    storiesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit the batch
    await batch.commit();

  } catch (error) {
    console.error("Error deleting user data:", error);
    throw error;
  }
}