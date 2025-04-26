let allStories = [];

export function initializeSearch(storiesArray) {
  allStories = storiesArray;
}


// ******************** SEARCH FUNCTION ******************* //

export function renderStories(stories) {
  let storiesHTML = "";

  if (stories.length === 0) {
    storiesHTML = "<p>No stories found matching your search.</p>";
  } else {
    stories.forEach((story) => {
      storiesHTML += `
        <div class="story-card" data-story-id="${story.id}">
          <h2 class="story-title">${story.title}</h2>
          <a href="story-detail.html?storyId=${story.id}">
            <img src="${story.images}" alt="${story.title}" class="story-img" />
          </a>
          <a href="story-detail.html?storyId=${story.id}" class="read-button">Read Story</a>
        </div>
      `;
    });
  }

  const storiesContainer = document.getElementById("stories-container");

  if (storiesContainer) {
    storiesContainer.innerHTML = storiesHTML;

    // Make the whole story-card and the title clickable
    storiesContainer.querySelectorAll(".story-card").forEach((card) => {
      const storyId = card.getAttribute("data-story-id");

      // Click the card
      card.addEventListener("click", (e) => {
        const target = e.target;
        if (
          !target.classList.contains("story-img") &&
          !target.classList.contains("read-button")
        ) {
          window.location.href = `story-detail.html?storyId=${storyId}`;
        }
      });

      // Click the title
      const title = card.querySelector(".story-title");
      if (title) {
        title.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent double redirection
          window.location.href = `story-detail.html?storyId=${storyId}`;
        });
      }
    });
  } else {
    console.error("Stories container element not found.");
  }
}


function filterStories(searchTerm) {
  return allStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchTerm) ||
      story.origin.toLowerCase().includes(searchTerm)
  );
}



// ******************** OPEN OR CLOSE MODAL ******************* //

window.openAnceStorySearchModal = function() {
  const modal = document.getElementById("anceStorySearchModal");
  modal.style.display = "block";
};

window.closeAnceStorySearchModal = function() {
  const modal = document.getElementById("anceStorySearchModal");
  modal.style.display = "none";
};


// ******************** PERFORM SEARCH ******************* //

window.performModalSearch = function() {
  const searchInput = document.getElementById("modalSearchInput");
  if (searchInput) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredResults = filterStories(searchTerm);
    renderStories(filteredResults);
    closeAnceStorySearchModal(); 
    window.location.href = "#stories"; 
  }
};


// ******************** CLOSE THE MODAL ******************* //

window.addEventListener('click', function(event) {
  const modal = document.getElementById('anceStorySearchModal');
  if (event.target === modal) {
    closeAnceStorySearchModal();
  }
});