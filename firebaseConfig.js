//--------------Import Firebase SDK--------------//
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

//--------------Firebase Config--------------//
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

//--------------Initialize Firebase--------------//
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchStories() {
  try {
    const querySnapshot = await getDocs(collection(db, "Stories"));
    let storiesHTML = "";

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(data);
      let imageTag = "";

      if (data.images) {
        imageTag = `<img src="${data.images}" alt="${data.title}" class="story-img">`;
      }

      storiesHTML += `
        <div class="story-card">
          <h2>${data.title}</h2>
          <p><strong>Origin:</strong> ${data.origin}</p>
          <p>${data.story}</p>
          ${imageTag}
        </div>
      `;
    });

    document.getElementById("stories-container").innerHTML = storiesHTML;
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
}

window.onload = fetchStories;
