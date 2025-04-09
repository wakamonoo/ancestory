import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
      import {
        getFirestore,
        collection,
        getDocs,
      } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
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
      async function fetchStories() {
        try {
          const querySnapshot = await getDocs(collection(db, "Stories"));
          let storiesHTML = "";

          if (querySnapshot.empty) {
            console.log("No stories found");
          }
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Fetched story:", data);

            let imageTag = "";
            if (data.images) {
              imageTag = `
                    <a href="story-detail.html?storyId=${doc.id}">
                      <img src="${data.images}" alt="${data.title}" class="story-img" />
                    </a>
                    <a href="story-detail.html?storyId=${doc.id}" class="read-button">Read Story</a>
                  `;
            }

            storiesHTML += `
                  <div class="story-card">
                    <h2>${data.title}</h2>
                    ${imageTag}
                  </div>
                `;
          });

          const storiesContainer = document.getElementById("stories-container");
          if (storiesHTML === "") {
            storiesContainer.innerHTML = "<p>No stories available</p>";
          } else {
            storiesContainer.innerHTML = storiesHTML;
          }
        } catch (error) {
          console.error("Error fetching stories: ", error);
        }
      }
      fetchStories();