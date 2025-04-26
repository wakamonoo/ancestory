import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { renderStories, initializeSearch } from './search.js'; 

const firebaseConfig = {
  apiKey: "AIzaSyAy4tekaIpT8doUUP0xA2oHeI9n6JgbybU",
  authDomain: "ancestory-c068e.firebaseapp.com",
  databaseURL:
    "https://ancestory-c068e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ancestory-c068e",
  storageBucket: "ancestory-c068e.firebasestorage.app",
  messagingSenderId: "579709470015",
  appId: "1:579709470015:web:adbbc5cba7f4e53f617f8a",
  measurementId: "G-S5SQWC7PEM",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let allStories = []; 

async function fetchStories() {
  try {
    const querySnapshot = await getDocs(collection(db, "Stories"));
    allStories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    renderStories(allStories); 
    initializeSearch(allStories); 
  } catch (error) {
    console.error("Error fetching stories: ", error);
    document.getElementById("stories-container").innerHTML =
      "<p>Failed to load stories.</p>";
  }
}

fetchStories();