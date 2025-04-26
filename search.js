let allStories = [];

export function initializeSearch(storiesArray) {
  allStories = storiesArray;
}


// ******************** SEARCH FUNCTION ******************* //



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