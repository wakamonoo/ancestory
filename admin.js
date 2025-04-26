import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
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

const logoutBtn = document.getElementById("admin-logout-btn");
const storyForm = document.getElementById("admin-story-form");
const storiesList = document.getElementById("admin-stories-list");
const editModal = document.getElementById("admin-edit-modal");
const editForm = document.getElementById("admin-edit-form");
const closeModalBtn = document.querySelector(".admin-edit-modal-close");




// ******************** CHECK AUTH STATE ******************* //

onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== "joven.serdanbataller21@gmail.com") {
    window.location.href = "index.html";
    return;
  }
  loadStories();
});



// ******************** LOGOUT ******************* //

logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
});


// ******************** ADD NEW STORY FUNCTION ******************* //

storyForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("admin-title").value.trim();
  const origin = document.getElementById("admin-origin").value.trim();
  const story = document.getElementById("admin-story").value.trim();
  const filipino = document.getElementById("admin-filipino").value.trim();
  const image = document.getElementById("admin-image").value.trim();

  if (!title || !origin || !story) {
    await Swal.fire({
      title: "Missing Information",
      text: "Please fill in all required fields.",
      icon: "warning",
      confirmButtonText: "Okay",
      background: "#FF6F61",
      color: "#20462f",
      confirmButtonColor: "#FF9A8B",
    });
    return;
  }  

  try {
    await addDoc(collection(db, "Stories"), {
      title,
      origin,
      story,
      filipino: filipino || "",
      images: image || "",
      createdAt: new Date(),
      createdBy: auth.currentUser.uid,
    });

    storyForm.reset();
    loadStories();
  } catch (error) {
    console.error("Error adding story: ", error);
    showError("Error adding story. Please try again.");
  }
});


// ******************** LOAD STORIES FUNCTION ******************* //

async function loadStories() {
  storiesList.innerHTML = '<div class="admin-loading">Loading stories...</div>';

  try {
    const querySnapshot = await getDocs(collection(db, "Stories"));
    storiesList.innerHTML = "";

    if (querySnapshot.empty) {
      storiesList.innerHTML =
        '<div class="admin-loading">No stories found.</div>';
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const storyElement = document.createElement("div");
      storyElement.className = "admin-story-card";
      storyElement.innerHTML = `
        <h3 class="admin-story-title">${data.title || "Untitled Story"}</h3>
        <p class="admin-story-origin"><strong>Origin:</strong> ${
          data.origin || "Unknown"
        }</p>
        <div class="admin-story-content">
          <p><strong>English:</strong> ${data.story.substring(0, 100)}${
        data.story.length > 100 ? "..." : ""
      }</p>
          ${
            data.filipino
              ? `<p><strong>Filipino:</strong> ${data.filipino.substring(
                  0,
                  100
                )}${data.filipino.length > 100 ? "..." : ""}</p>`
              : "<p><em>No Filipino translation yet</em></p>"
          }
          ${
            data.images
              ? `<img src="${data.images}" alt="${data.title}" class="admin-story-img">`
              : ""
          }
        </div>
        <div class="admin-story-meta">
          <small>Added: ${
            data.createdAt?.toDate().toLocaleDateString() || "Unknown date"
          }</small>
        </div>
        <div class="admin-story-actions">
          <button class="admin-edit-btn" data-id="${doc.id}">Edit</button>
          <button class="admin-delete-btn" data-id="${doc.id}">Delete</button>
        </div>
      `;
      storiesList.appendChild(storyElement);
    });

    document.querySelectorAll(".admin-edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => openEditModal(btn.dataset.id));
    });

    document.querySelectorAll(".admin-delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => deleteStory(btn.dataset.id));
    });
  } catch (error) {
    console.error("Error loading stories: ", error);
    showError("Error loading stories. Please try again.");
  }
}


// ******************** DELETE STORY FUNCTION ******************* //

async function deleteStory(storyId) {
  if (!confirm("Are you sure you want to delete this story?")) return;

  try {
    await deleteDoc(doc(db, "Stories", storyId));
    loadStories();
  } catch (error) {
    console.error("Error deleting story: ", error);
    showError("Error deleting story. Please try again.");
  }
}


// ******************** EDIT STORIES FUNCTION ******************* //

async function openEditModal(storyId) {
  try {
    const docRef = doc(db, "Stories", storyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("admin-edit-id").value = storyId;
      document.getElementById("admin-edit-title").value = data.title || "";
      document.getElementById("admin-edit-origin").value = data.origin || "";
      document.getElementById("admin-edit-story").value = data.story || "";
      document.getElementById("admin-edit-filipino").value =
        data.filipino || "";
      document.getElementById("admin-edit-image").value = data.images || "";

      editModal.style.display = "flex";
    } else {
      showError("Story not found");
    }
  } catch (error) {
    console.error("Error opening edit modal: ", error);
    showError("Error loading story for editing.");
  }
}

closeModalBtn.addEventListener("click", () => {
  editModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.style.display = "none";
  }
});




// ******************** SAVE EDITED STORIES FUNCTION ******************* //

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const storyId = document.getElementById("admin-edit-id").value;
  const title = document.getElementById("admin-edit-title").value.trim();
  const origin = document.getElementById("admin-edit-origin").value.trim();
  const story = document.getElementById("admin-edit-story").value.trim();
  const filipino = document.getElementById("admin-edit-filipino").value.trim();
  const image = document.getElementById("admin-edit-image").value.trim();

  if (!title || !origin || !story) {
    showError("Please fill in all required fields");
    return;
  }

  try {
    await updateDoc(doc(db, "Stories", storyId), {
      title,
      origin,
      story,
      filipino: filipino || "",
      images: image || "",
      updatedAt: new Date(),
    });

    editModal.style.display = "none";
    loadStories();
  } catch (error) {
    console.error("Error updating story: ", error);
    showError("Error updating story. Please try again.");
  }
});

function showError(message) {
  const errorElement = document.createElement("div");
  errorElement.className = "admin-error";
  errorElement.textContent = message;
  storiesList.prepend(errorElement);

  setTimeout(() => {
    errorElement.remove();
  }, 5000);
}
