import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signOut,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc,
  getDocs,
  deleteDoc,
  doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAy4tekaIpT8doUUP0xA2oHeI9n6JgbybU",
  authDomain: "ancestory-c068e.firebaseapp.com",
  databaseURL: "https://ancestory-c068e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ancestory-c068e",
  storageBucket: "ancestory-c068e.appspot.com",
  messagingSenderId: "579709470015",
  appId: "1:579709470015:web:adbbc5cba7f4e53f617f8a",
  measurementId: "G-S5SQWC7PEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== "joven.serdanbataller21@gmail.com") {
    window.location.href = "index.html";
  }
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("Logout error:", error);
  });
});

// Form submission
document.getElementById('story-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const origin = document.getElementById('origin').value;
  const story = document.getElementById('story').value;
  const image = document.getElementById('image').value;

  try {
    await addDoc(collection(db, "Stories"), {
      title,
      origin,
      story,
      images: image || ""
    });
    
    alert("Story added successfully!");
    document.getElementById('story-form').reset();
    loadStories();
  } catch (error) {
    console.error("Error adding story: ", error);
    alert("Error adding story. Please try again.");
  }
});

// Load existing stories
async function loadStories() {
  const querySnapshot = await getDocs(collection(db, "Stories"));
  const container = document.getElementById('admin-stories-container');
  container.innerHTML = '';

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const storyElement = document.createElement('div');
    storyElement.className = 'admin-story-card';
    storyElement.innerHTML = `
      <h3>${data.title}</h3>
      <p><strong>Origin:</strong> ${data.origin}</p>
      <p>${data.story.substring(0, 100)}...</p>
      ${data.images ? `<img src="${data.images}" alt="${data.title}" class="admin-story-img">` : ''}
      <button class="delete-btn" data-id="${doc.id}">Delete</button>
    `;
    container.appendChild(storyElement);
  });

  // Add delete event listeners
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      if (confirm('Are you sure you want to delete this story?')) {
        try {
          await deleteDoc(doc(db, "Stories", e.target.dataset.id));
          loadStories();
        } catch (error) {
          console.error("Error deleting story: ", error);
        }
      }
    });
  });
}

// Initial load
loadStories();