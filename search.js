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
      let imageTag = "";
      if (story.images) {
        imageTag = `
              <a href="story-detail.html?storyId=${story.id}">
                <img src="${story.images}" alt="${story.title}" class="story-img" />
              </a>
              <a href="story-detail.html?storyId=${story.id}" class="read-button">Read Story</a>
            `;
      }
      storiesHTML += `
            <div class="story-card">
              <h2>${story.title}</h2>
              ${imageTag}
            </div>
          `;
    });
  }
  const storiesContainer = document.getElementById("stories-container");
  if (storiesContainer) {
    storiesContainer.innerHTML = storiesHTML;
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