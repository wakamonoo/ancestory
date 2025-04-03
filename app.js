// app.js

import { db, storage } from './firebase-config.js'; // Import Firestore and Storage
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Function to Add Story to Firestore and upload Image to Firebase Storage
async function addStory(title, origin, content, file) {
  try {
    let imageUrl = "";
    
    // If a file is uploaded, store it in Firebase Storage
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Add story to Firestore database
    await addDoc(collection(db, "stories"), {
      title: title,
      origin: origin,
      content: content,
      imageUrl: imageUrl
    });

    alert("Story added successfully!");
  } catch (error) {
    console.error("Error adding story:", error);
  }
}

// Function to Retrieve and Display Stories
async function displayStories() {
  const querySnapshot = await getDocs(collection(db, "stories"));
  let storiesContainer = document.getElementById("stories");

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const storyHTML = `
      <div class="story">
        <h2>${data.title}</h2>
        <p><strong>Origin:</strong> ${data.origin}</p>
        <p>${data.content}</p>
        ${data.imageUrl ? `<img src="${data.imageUrl}" alt="Story Image" style="max-width:100%;">` : ""}
      </div>
    `;
    storiesContainer.innerHTML += storyHTML;
  });
}

// Event listener for form submission
document.getElementById("storyForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  const title = document.getElementById("title").value;
  const origin = document.getElementById("origin").value;
  const content = document.getElementById("content").value;
  const imageFile = document.getElementById("image").files[0];

  await addStory(title, origin, content, imageFile);
  window.location.reload();  // Reload to display updated stories
});

// Call displayStories when the page is loaded
document.addEventListener("DOMContentLoaded", displayStories);
