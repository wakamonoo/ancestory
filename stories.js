import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { renderStories, initializeSearch } from "./search.js";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL:
    "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
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
