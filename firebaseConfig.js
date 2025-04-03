// Import Firebase SDK (Make sure you're using the correct version)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your Firebase configuration
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
const db = getFirestore(app);

// Fetch stories function
async function fetchStories() {
  try {
    const querySnapshot = await getDocs(collection(db, "Stories"));
    let storiesHTML = "";

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(data); // Check if you're getting data from Firestore
      let imageTag = "";

      // Check if image exists and insert into HTML
      if (data.images) {
        imageTag = `<img src="${data.images}" alt="${data.title}" class="story-img">`;
      }

      // Construct story card HTML
      storiesHTML += `
        <div class="story-card">
          <h2>${data.title}</h2>
          <p><strong>Origin:</strong> ${data.origin}</p>
          <p>${data.story}</p>
          ${imageTag}
        </div>
      `;
    });

    // Insert the constructed HTML into the DOM
    document.getElementById("stories-container").innerHTML = storiesHTML;

  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
}

// Fetch stories on page load
window.onload = fetchStories;
