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
  GoogleAuthProvider,
  reauthenticateWithPopup,
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
let isAccountBeingDeleted = false; 

// ******************** PAGE INITIALIZATION ******************* //
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, handleAuthStateChange);

  const backButton = document.querySelector(".back-button");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.history.back();
    });
  }

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



// ******************** ACCOUNT DELETION ******************* //

  const deleteAccountBtn = document.getElementById("deleteAccountBtn");
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", handleAccountDeletion);
  }
});

function handleAuthStateChange(user) {
  if (isAccountBeingDeleted) return;

  if (user) {
    currentUser = user;
    loadUserProfile();
    loadUserComments();
    loadUserReactions();
  } else {
    if (!isAccountBeingDeleted) {
      window.location.href = "index.html";
    }
  }
}

// ******************** USER PROFILE ******************* //

async function loadUserProfile() {
  if (!currentUser) return;
  const userDoc = await getDoc(doc(db, "users", currentUser.uid));

  const displayName =
    currentUser.displayName || userDoc.data()?.displayName || "User";
  const userNameDisplay = document.getElementById("userNameDisplay");
  if (userNameDisplay) {
    userNameDisplay.textContent = displayName;
  }

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


// ******************** USER COMMENTS ******************* //
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

  const commentsByStory = {};
  querySnapshot.forEach((doc) => {
    const comment = doc.data();
    if (!commentsByStory[comment.storyId]) {
      commentsByStory[comment.storyId] = [];
    }
    commentsByStory[comment.storyId].push({ id: doc.id, ...comment });
  });

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
            <button class="delete-commentAcc" data-comment-id="${comment.id}">
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

  document.querySelectorAll(".delete-commentAcc").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const commentId = e.currentTarget.dataset.commentId;
      await deleteComment(commentId);
    });
  });
}


// ******************** DELETE COMMENT ******************* //

async function deleteComment(commentId) {
  try {
    const result = await Swal.fire({
      title: "Delete Comment?",
      text: "This action cannot be undone!",
      icon: "warning",
      iconColor: "#20462f", 
      background: "#D29F80",
      color: "#20462f", 
      showCancelButton: true,
      confirmButtonColor: "#C09779", 
      cancelButtonColor: "#F1D1B5", 
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "comments", commentId));
      await Swal.fire({
        title: "Deleted!",
        text: "Your comment has been deleted.",
        icon: "success",
        iconColor: "#20462f",
        background: "#D29F80",
        color: "#20462f",
        confirmButtonColor: "#C09779",
      });
      loadUserComments(); 
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    await Swal.fire({
      title: "Error!",
      text: "Failed to delete comment.",
      icon: "error",
      iconColor: "#20462f",
      background: "#D29F80",
      color: "#20462f",
      confirmButtonColor: "#C09779",
    });
  }
}


// ******************** USER REACTIONS ******************* //

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

  const reactionsByStory = {};
  querySnapshot.forEach((doc) => {
    const reaction = doc.data();
    if (!reactionsByStory[reaction.storyId]) {
      reactionsByStory[reaction.storyId] = [];
    }
    reactionsByStory[reaction.storyId].push({ id: doc.id, ...reaction });
  });

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
            <button class="delete-reactionAcc" data-reaction-id="${
              reaction.id
            }">
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

  document.querySelectorAll(".delete-reactionAcc").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const reactionId = e.currentTarget.dataset.reactionId;
      await deleteReaction(reactionId);
    });
  });
}



// ******************** DELETE REACTIONS ******************* //

async function deleteReaction(reactionId) {
  try {
    const result = await Swal.fire({
      title: "Remove Reaction?",
      text: "This will remove your reaction from the story.",
      icon: "warning",
      iconColor: "#20462f",
      background: "#D29F80",
      color: "#20462f",
      showCancelButton: true,
      confirmButtonColor: "#C09779",
      cancelButtonColor: "#F1D1B5",
      confirmButtonText: "Yes, remove it!",
    });
  
    if (result.isConfirmed) {
      await deleteDoc(doc(db, "reactions", reactionId));
      Swal.fire({
        title: "Removed!",
        text: "Your reaction has been removed.",
        icon: "success",
        iconColor: "#20462f",
        background: "#D29F80",
        color: "#20462f",
        confirmButtonColor: "#C09779"
      });
      loadUserReactions();
    }
  } catch (error) {
    console.error("Error deleting reaction:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to remove reaction.",
      icon: "error",
      iconColor: "#20462f",
      background: "#D29F80",
      color: "#20462f",
      confirmButtonColor: "#C09779"
      });
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

// ******************** ACCOUNT DELETION ******************* //

async function handleAccountDeletion() {
  try {
    isAccountBeingDeleted = true;

    const firstConfirm = await Swal.fire({
      title: "Delete Your Account?",
      text: "This will permanently erase your account and all data!",
      icon: "warning",
      iconColor: "#20462f",
      showCancelButton: true,
      confirmButtonColor: "#C09779",
      cancelButtonColor: "#F1D1B5",
      confirmButtonText: "Continue",
      cancelButtonText: "Cancel",
      background: "#D29F80",
      color: "#20462f",
    });
    

    if (!firstConfirm.isConfirmed) {
      isAccountBeingDeleted = false;
      return;
    }

    const isGoogleUser = currentUser.providerData.some(
      (p) => p.providerId === "google.com"
    );

    if (isGoogleUser) {
      await reauthenticateWithPopup(currentUser, new GoogleAuthProvider());
    } else {
      const { value: password } = await Swal.fire({
        title: "Verify Password",
        input: "password",
        inputLabel: "Enter your password to confirm deletion",
        showCancelButton: true,
        confirmButtonColor: "#C09779",
        cancelButtonColor: "#F1D1B5",
        inputValidator: (value) => (value ? null : "Password is required"),
        background: "#D29F80",
        color: "#20462f",
      });      

      if (!password) {
        isAccountBeingDeleted = false;
        return;
      }

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(currentUser, credential);
    }

    const finalConfirm = await Swal.fire({
      title: "Confirm Permanent Deletion",
      text: "This cannot be undone! All your data will be erased.",
      icon: "error",
      iconColor: "#20462f",
      showCancelButton: true,
      confirmButtonColor: "#C09779",
      cancelButtonColor: "#F1D1B5",
      confirmButtonText: "DELETE NOW",
      cancelButtonText: "Cancel",
      background: "#D29F80",
      color: "#20462f",
    });
    

    if (!finalConfirm.isConfirmed) {
      isAccountBeingDeleted = false;
      return;
    }

    const deletionSwal = Swal.fire({
      title: "Deleting Account...",
      html: `
        <div class="deletion-progress">
          <div>Deleting your account and data</div>
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      background: "#D29F80",
      color: "#20462f",
    });
    
    try {
      await deleteUser(currentUser);
      document.querySelector(".progress-fill").style.width = "50%";

      await deleteUserData(currentUser.uid);
      document.querySelector(".progress-fill").style.width = "100%";

      await deletionSwal.close();

      await Swal.fire({
        title: "Account Deleted",
        icon: "success",
        iconColor: "#20462f",
        text: "Your account has been permanently removed.",
        confirmButtonText: "Continue",
        background: "#D29F80",
        color: "#20462f",
        confirmButtonColor: "#C09779"
      });
      
      window.location.href = "index.html";
    } catch (error) {
      isAccountBeingDeleted = false;
      await deletionSwal.close();
      console.error("Deletion failed:", error);
      await Swal.fire({
        title: "Deletion Failed",
        text: error.message || "Could not complete account deletion",
        icon: "error",
        iconColor: "#20462f",
        confirmButtonText: "OK",
        background: "#D29F80",
        color: "#20462f",
        confirmButtonColor: "#C09779"
      });
      
    }
  } catch (error) {
    isAccountBeingDeleted = false;
    console.error("Account deletion error:", error);
    await Swal.fire({
      title: "Error",
      text: error.message || "Something went wrong",
      icon: "error",
      iconColor: "#20462f",
      confirmButtonText: "OK",
      background: "#D29F80",
      color: "#20462f",
      confirmButtonColor: "#C09779"
    });    
  }
}



// ******************** DELETE USER DATA ******************* //

async function deleteUserData(uid) {
  const batch = writeBatch(db);

  const userRef = doc(db, "users", uid);
  batch.delete(userRef);

  const commentsQuery = query(
    collection(db, "comments"),
    where("userId", "==", uid)
  );
  const commentsSnapshot = await getDocs(commentsQuery);
  commentsSnapshot.forEach((doc) => batch.delete(doc.ref));

  const reactionsQuery = query(
    collection(db, "reactions"),
    where("userId", "==", uid)
  );
  const reactionsSnapshot = await getDocs(reactionsQuery);
  reactionsSnapshot.forEach((doc) => batch.delete(doc.ref));

  try {
    await batch.commit();
    console.log("User data deleted successfully.");
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw error; 
  }
}


