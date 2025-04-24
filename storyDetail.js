// storyDetail.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { StorySpeechSynthesis } from './speechSynthesis.js';

const firebaseConfig = {
  apiKey: "AIzaSyAy4tekaIpT8doUUP0xA2oHeI9n6JgbybU",
  authDomain: "ancestory-c068e.firebaseapp.com",
  databaseURL: "https://ancestory-c068e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ancestory-c068e",
  storageBucket: "ancestory-c068e.appspot.com",
  messagingSenderId: "579709470015",
  appId: "1:579709470015:web:adbbc5cba7f4e53f617f8a",
  measurementId: "G-S5SQWC7PEM",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
let currentStoryId = null;
let currentUserReaction = null;
let isTranslated = false;
let originalContent = {
  title: "",
  origin: "",
  story: "",
};
let speechSynthesizer = null;

// Initialize speech synthesis when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if ('speechSynthesis' in window) {
    speechSynthesizer = new StorySpeechSynthesis();
    
    // Set up event handlers
    speechSynthesizer.onSpeechEnd = onSpeechEnd;
    speechSynthesizer.onSpeechError = onSpeechError;
    speechSynthesizer.onWordBoundary = highlightSpokenWord;
    
    // Set up UI event listeners
    setupSpeechUI();
  } else {
    document.getElementById('speak-btn').style.display = 'none';
    console.warn('Speech synthesis not supported');
  }
});

// Check auth state
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    document.getElementById("comment-form").style.display = "flex";
    checkUserReaction();
  } else {
    document.getElementById("comment-form").style.display = "none";
  }
});

async function fetchStoryDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  currentStoryId = urlParams.get("storyId");

  if (!currentStoryId) {
    console.error("Story ID not found");
    return;
  }

  const docRef = doc(db, "Stories", currentStoryId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    originalContent = {
      title: data.title,
      origin: data.origin || "",
      story: data.story || "",
    };

    document.getElementById("story-title").innerText = data.title;
    document.getElementById("story-origin").innerText = data.origin || "";

    const content = data.story || "";
    document.getElementById("story-content").innerHTML =
      formatStoryContent(content);

    if (data.images) {
      document.getElementById("story-image").src = data.images;
      document.getElementById("story-image").style.display = "block";
    } else {
      document.getElementById("story-image").style.display = "none";
    }
  } else {
    console.log("No such document!");
    document.getElementById("story-content").innerHTML =
      "<p>Story not found</p>";
  }

  loadReactions();
  loadComments();
}

// SPEECH FUNCTIONS
function setupSpeechUI() {
  const speakBtn = document.getElementById('speak-btn');
  const stopBtn = document.getElementById('stop-speech-btn');
  
  speakBtn.addEventListener('click', toggleSpeech);
  stopBtn.addEventListener('click', stopSpeech);
  
  // Modal controls
  document.getElementById('voice-select-modal').addEventListener('change', (e) => {
    speechSynthesizer.changeVoice(e.target.selectedOptions[0].getAttribute('data-name'));
  });
  
  document.getElementById('rate-control-modal').addEventListener('input', (e) => {
    const rate = parseFloat(e.target.value);
    speechSynthesizer.changeRate(rate);
    document.getElementById('rate-value').textContent = `${rate.toFixed(1)}x`;
  });
  
  document.getElementById('apply-speech-options').addEventListener('click', () => {
    closeModal();
    startReadingStory();
  });
  
  document.querySelector('.close-modal').addEventListener('click', closeModal);
}

function toggleSpeech() {
  if (speechSynthesizer.isSpeaking) {
    speechSynthesizer.pauseSpeech();
    updateSpeechUI(false);
  } else {
    openModal();
  }
}

function startReadingStory() {
  const title = document.getElementById('story-title').textContent;
  const origin = document.getElementById('story-origin').textContent.replace('Origin:', '').trim();
  const contentElement = document.getElementById('story-content');
  
  // Clone the content element for manipulation
  const contentClone = contentElement.cloneNode(true);
  contentElement.parentNode.replaceChild(contentClone, contentElement);
  contentClone.id = 'story-content';
  
  speechSynthesizer.startSpeech(title, origin, contentClone);
  updateSpeechUI(true);
}

function stopSpeech() {
  speechSynthesizer.stopSpeech();
  updateSpeechUI(false);
  removeHighlighting();
}

function onSpeechEnd() {
  updateSpeechUI(false);
  removeHighlighting();
}

function onSpeechError(event) {
  // Only show error if it's not a user-initiated stop
  if (event.error !== 'interrupted') {
    Swal.fire({
      title: "Speech Error",
      text: "An error occurred while reading the story.",
      icon: "error",
      iconColor: "#20462f",
      confirmButtonText: "Okay",
      background: "#D29F80",
      color: "#20462f",
      confirmButtonColor: "#C09779",
    });
  }
  updateSpeechUI(false);
  removeHighlighting();
}

function highlightSpokenWord(event) {
  if (event.name !== 'word') return;
  
  const charIndex = event.charIndex;
  const charLength = event.charLength;
  
  // Remove previous highlights first
  removeHighlighting();
  
  // Determine which section is being spoken
  let element, adjustedIndex;
  
  if (charIndex < speechSynthesizer.titleLength) {
    // Title section
    element = document.getElementById('story-title');
    adjustedIndex = charIndex;
  } else if (charIndex < speechSynthesizer.titleLength + speechSynthesizer.originLength) {
    // Origin section
    element = document.getElementById('story-origin');
    adjustedIndex = charIndex - speechSynthesizer.titleLength;
  } else {
    // Main content section
    element = document.getElementById('story-content');
    adjustedIndex = charIndex - (speechSynthesizer.titleLength + speechSynthesizer.originLength);
  }
  
  // Mobile workaround - sometimes the element isn't ready
  if (!element) {
    console.warn('Element not found for highlighting');
    return;
  }

  // Clone the node to ensure we can modify it
  const clone = element.cloneNode(true);
  element.parentNode.replaceChild(clone, element);
  element = clone;
  element.id = element.id; // Maintain the same ID
  
  const { node, position } = findTextNodeAndPosition(element, adjustedIndex);
  
  if (node && position !== -1) {
    try {
      const range = document.createRange();
      range.setStart(node, position);
      range.setEnd(node, position + charLength);
      
      const span = document.createElement('span');
      span.className = 'highlight-word';
      range.surroundContents(span);
      
      // Mobile-friendly scroll behavior
      requestAnimationFrame(() => {
        scrollToHighlight(span);
      });
    } catch (e) {
      console.error('Could not highlight word:', e);
    }
  }
}


function findTextNodeAndPosition(element, charIndex) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  let currentIndex = 0;
  let node;
  
  while (node = walker.nextNode()) {
    const nodeLength = node.textContent.length;
    if (currentIndex + nodeLength > charIndex) {
      return {
        node: node,
        position: charIndex - currentIndex
      };
    }
    currentIndex += nodeLength;
  }
  
  return { node: null, position: -1 };
}

function scrollToHighlight(element) {
  const storyContainer = document.getElementById('storyContainer') || document.documentElement;
  const elementRect = element.getBoundingClientRect();
  const containerRect = storyContainer.getBoundingClientRect();
  
  // Calculate positions with mobile viewport in mind
  const elementTop = elementRect.top - containerRect.top;
  const elementBottom = elementRect.bottom - containerRect.top;
  const containerHeight = window.innerHeight || containerRect.height;
  
  // Mobile-optimized scrolling
  if (elementTop < storyContainer.scrollTop + 50) { // 50px buffer
    storyContainer.scrollTo({
      top: elementTop - 20,
      behavior: 'smooth'
    });
  } else if (elementBottom > storyContainer.scrollTop + containerHeight - 50) {
    storyContainer.scrollTo({
      top: elementBottom - containerHeight + 20,
      behavior: 'smooth'
    });
  }
}

function removeHighlighting() {
  const highlights = document.querySelectorAll('.highlight-word');
  highlights.forEach(highlight => {
    const parent = highlight.parentNode;
    parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
    parent.normalize();
  });
}

// Modal functions
function openModal() {
  const modal = document.getElementById('speech-options-modal');
  modal.style.display = 'block';
  
  // Populate voices
  const voiceSelect = document.getElementById('voice-select-modal');
  voiceSelect.innerHTML = '';
  
  speechSynthesizer.getVoices().forEach(voice => {
    const option = document.createElement('option');
    // Format voice name nicely
    let displayName = voice.name;
    if (voice.name.toLowerCase().includes('angelo')) displayName = "Angelo (Filipino)";
    else if (voice.name.toLowerCase().includes('blessica')) displayName = "Blessica (Filipino)";
    else if (voice.name.toLowerCase().includes('andrew')) displayName = "Andrew (English)";
    else if (voice.name.toLowerCase().includes('emma')) displayName = "Emma (English)";
    
    option.textContent = displayName;
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
    
    if (voice === speechSynthesizer.getCurrentVoice()) {
      option.selected = true;
    }
  });
  
  // Set rate control
  const rateControl = document.getElementById('rate-control-modal');
  rateControl.value = speechSynthesizer.getCurrentRate();
  document.getElementById('rate-value').textContent = `${speechSynthesizer.getCurrentRate().toFixed(1)}x`;
}

function closeModal() {
  document.getElementById('speech-options-modal').style.display = 'none';
}

function updateSpeechUI(isSpeaking) {
  const speakBtn = document.getElementById('speak-btn');
  const stopBtn = document.getElementById('stop-speech-btn');
  
  if (isSpeaking) {
    speakBtn.style.display = 'none';
    stopBtn.style.display = 'flex';
    speakBtn.querySelector('span').textContent = 'Pause';
  } else {
    speakBtn.style.display = 'flex';
    stopBtn.style.display = 'none';
    speakBtn.querySelector('span').textContent = 'Listen';
  }
}

function formatStoryContent(content) {
  return content
    .split("\n")
    .map((paragraph) => {
      if (!paragraph.trim()) return "<br>";
      return `<p class="story-paragraph">${paragraph.replace(
        /(\S+)\s+/g,
        "$1 "
      )}</p>`;
    })
    .join("");
}

async function toggleTranslation() {
  const translateToggle = document.getElementById("translate-toggle");

  if (isTranslated) {
    // Revert to original English content for story
    document.getElementById("story-title").innerText = originalContent.title;
    document.getElementById("story-origin").innerText = originalContent.origin;
    document.getElementById("story-content").innerHTML = formatStoryContent(
      originalContent.story
    );
    isTranslated = false;
  } else {
    // Show loading state on the toggle
    translateToggle.disabled = true;

    try {
      // Fetch the story document from Firestore using currentStoryId
      const docRef = doc(db, "Stories", currentStoryId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // If the Filipino translation exists for the story, update only the story
        if (data.filipino) {
          document.getElementById("story-title").innerText =
            originalContent.title;
          document.getElementById("story-origin").innerText =
            originalContent.origin;
          document.getElementById("story-content").innerHTML =
            formatStoryContent(data.filipino);
          isTranslated = true;
        } else {
          // No Filipino translation available
          translateToggle.checked = false;
          Swal.fire({
            title: "Translation Not Available",
            text: "Filipino translation is not available for this story yet.",
            icon: "info",
            iconColor: "#20462f",
            confirmButtonText: "Okay",
            background: "#D29F80",
            color: "#20462f",
            confirmButtonColor: "#C09779",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching translation:", error);
      translateToggle.checked = false;
      Swal.fire({
        title: "Error",
        text: "Could not fetch the translation. Please try again later.",
        icon: "error",
        iconColor: "#20462f",
        confirmButtonText: "Okay",
        background: "#D29F80",
        color: "#20462f",
        confirmButtonColor: "#C09779",
      });
    } finally {
      translateToggle.disabled = false;
    }
  }
}

async function loadReactions() {
  const reactionsRef = collection(db, "reactions");
  const q = query(reactionsRef, where("storyId", "==", currentStoryId));
  const querySnapshot = await getDocs(q);

  const reactions = {};
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (!reactions[data.reactionType]) {
      reactions[data.reactionType] = 0;
    }
    reactions[data.reactionType]++;
  });

  updateReactionUI(reactions);
}

async function checkUserReaction() {
  if (!currentUser || !currentStoryId) return;

  const reactionsRef = collection(db, "reactions");
  const q = query(
    reactionsRef,
    where("storyId", "==", currentStoryId),
    where("userId", "==", currentUser.uid)
  );

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    currentUserReaction = querySnapshot.docs[0].data().reactionType;
    updateReactionButton(currentUserReaction);
  }
}

function updateReactionUI(reactions) {
  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
  const reactionStatsElement = document.querySelector(".reaction-stats");
  const likeCountElement = document.getElementById("like-count");

  // Clear all existing reaction elements except the count
  while (reactionStatsElement.firstChild) {
    if (reactionStatsElement.firstChild === likeCountElement) {
      break;
    }
    reactionStatsElement.removeChild(reactionStatsElement.firstChild);
  }

  if (totalReactions === 0) {
    likeCountElement.textContent = "0 reactions";
  } else {
    const reactionEntries = Object.entries(reactions);
    const sortedReactions = reactionEntries.sort((a, b) => b[1] - a[1]);

    if (reactionEntries.length === 1) {
      // Single reaction type: "X ReactionName"
      const [type, count] = reactionEntries[0];
      const icon = createReactionIcon(type);
      reactionStatsElement.insertBefore(icon, likeCountElement);
      likeCountElement.textContent = `${count} ${getReactionDisplayName(type)}${
        count !== 1 ? "s" : ""
      }`;
    } else {
      // Multiple reaction types: show all icons with commas (no spacing)
      sortedReactions.forEach(([type], index) => {
        const icon = createReactionIcon(type);
        reactionStatsElement.insertBefore(icon, likeCountElement);

        // Add comma separator without spacing
        if (index < sortedReactions.length - 1) {
          const comma = document.createElement("span");
          comma.textContent = ",";
          reactionStatsElement.insertBefore(comma, likeCountElement);
        }
      });

      likeCountElement.textContent = `${totalReactions}  reactions`;
    }
  }
}

function createReactionIcon(type) {
  const icon = document.createElement("i");
  icon.className = "fas";

  switch (type) {
    case "like":
      icon.className += " fa-thumbs-up";
      icon.style.color = "#216fdb";
      break;
    case "love":
      icon.className += " fa-heart";
      icon.style.color = "#f33e58";
      break;
    case "wow":
      icon.className += " fa-surprise";
      icon.style.color = "#f7b125";
      break;
    case "angry":
      icon.className += " fa-angry";
      icon.style.color = "#e9710f";
      break;
    default:
      icon.className += " fa-question";
  }

  return icon;
}

function getReactionDisplayName(reactionType) {
  const names = {
    like: "Like",
    love: "Love",
    wow: "Wow",
    angry: "Angry",
  };
  return names[reactionType] || reactionType;
}

function updateReactionButton(reactionType) {
  const likeBtn = document.querySelector(".like-btn");
  const icon = likeBtn.querySelector("i");
  const text = likeBtn.querySelector("span");

  switch (reactionType) {
    case "like":
      icon.className = "fas fa-thumbs-up";
      icon.style.color = "#216fdb";
      text.textContent = "Liked";
      break;
    case "love":
      icon.className = "fas fa-heart";
      icon.style.color = "#f33e58";
      text.textContent = "Loved";
      break;
    case "wow":
      icon.className = "fas fa-surprise";
      icon.style.color = "#f7b125";
      text.textContent = "Wow";
      break;
    case "angry":
      icon.className = "fas fa-angry";
      icon.style.color = "#e9710f";
      text.textContent = "Angry";
      break;
    default:
      icon.className = "fas fa-thumbs-up";
      icon.style.color = "";
      text.textContent = "Like";
  }
}

async function handleReaction(reactionType) {
  if (!currentUser) {
    Swal.fire({
      title: "Please login to react to stories",
      icon: "warning",
      showConfirmButton: true,
      confirmButtonText: "Okay",
      background: "#D29F80",
      color: "#20462f",
      confirmButtonColor: "#C09779",
      showClass: {
        popup: "animate__animated animate__fadeIn",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOut",
      },
    });
    return;
  }

  try {
    const reactionsRef = collection(db, "reactions");
    const q = query(
      reactionsRef,
      where("storyId", "==", currentStoryId),
      where("userId", "==", currentUser.uid)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingReaction = querySnapshot.docs[0];
      if (existingReaction.data().reactionType === reactionType) {
        await deleteDoc(existingReaction.ref);
        currentUserReaction = null;
        updateReactionButton(null);
      } else {
        await updateDoc(existingReaction.ref, {
          reactionType: reactionType,
          timestamp: serverTimestamp(),
        });
        currentUserReaction = reactionType;
        updateReactionButton(reactionType);
      }
    } else {
      await addDoc(reactionsRef, {
        storyId: currentStoryId,
        userId: currentUser.uid,
        reactionType: reactionType,
        timestamp: serverTimestamp(),
      });
      currentUserReaction = reactionType;
      updateReactionButton(reactionType);
    }

    loadReactions();
  } catch (error) {
    console.error("Error handling reaction:", error);
    let errorMessage = "Please try again later.";

    if (error.code === "permission-denied") {
      errorMessage = "You don't have permission to react to this story.";
    } else if (error.code === "unavailable") {
      errorMessage = "Network error. Please check your connection.";
    }

    Swal.fire({
      title: "Failed to react",
      text: errorMessage,
      icon: "error",
      iconColor: "#20462f",
      confirmButtonText: "Okay",
      background: "#D29F80",
      color: "#20462f",
      confirmButtonColor: "#C09779",
      showClass: {
        popup: "animate__animated animate__shakeX",
      },
    });
  }
}

// Add this function to your existing code
async function deleteComment(commentId) {
  if (!currentUser) return;

  try {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Delete Comment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      iconColor: "#20462f",
      showCancelButton: true,
      confirmButtonColor: "#C09779",
      cancelButtonColor: "#20462f",
      confirmButtonText: "Yes, delete it!",
      background: "#D29F80",
      color: "#20462f",
    });

    if (result.isConfirmed) {
      // Delete the comment from Firestore
      await deleteDoc(doc(db, "comments", commentId));

      // Show success message
      Swal.fire({
        title: "Deleted!",
        text: "Your comment has been deleted.",
        icon: "success",
        iconColor: "#20462f",
        timer: 1500,
        showConfirmButton: false,
        background: "#D29F80",
        color: "#20462f",
      });

      // Reload comments
      loadComments();
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to delete comment. Please try again.",
      icon: "error",
      iconColor: "#20462f",
      background: "#D29F80",
      color: "#20462f",
      confirmButtonColor: "#C09779",
    });
  }
}

// Modify the addCommentToDOM function to include delete button for user's own comments
function addCommentToDOM(comment) {
  const commentEl = document.createElement("div");
  commentEl.className = "comment";
  commentEl.dataset.commentId = comment.id;

  // Use the user's photo if available, otherwise use the default icon
  const avatarContent = comment.userPhoto
    ? `<img src="${comment.userPhoto}" alt="User Avatar" class="comment-avatar-img">`
    : `<i class="fas fa-user-circle" style="font-size: 32px; color: #20462f;"></i>`;

  // Add delete button if the comment belongs to the current user
  const deleteButton =
    currentUser && comment.userId === currentUser.uid
      ? `<button class="delete-comment-btn" title="Delete comment"><i class="fas fa-trash-alt"></i></button>`
      : "";

  commentEl.innerHTML = `
    <div class="comment-avatar">
      ${avatarContent}
    </div>
    <div class="comment-content">
      <div class="comment-header">
        <span class="comment-username">${comment.userName || "Anonymous"}</span>
        ${deleteButton}
      </div>
      ${comment.text}
      <div class="comment-time">${formatTime(comment.timestamp?.toDate())}</div>
    </div>
  `;

  const commentsSection = document.getElementById("comments-section");
  const firstChild = commentsSection.firstChild;

  if (firstChild && firstChild.textContent.includes("No comments yet")) {
    commentsSection.innerHTML = "";
  }

  commentsSection.prepend(commentEl);

  // Add event listener for delete button if it exists
  if (deleteButton && currentUser && comment.userId === currentUser.uid) {
    commentEl
      .querySelector(".delete-comment-btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        deleteComment(comment.id);
      });
  }
}

function formatTime(date) {
  if (!date) return "";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString(undefined, options);
}

// Update the loadComments function to include comment IDs
async function loadComments() {
  try {
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("storyId", "==", currentStoryId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const commentsSection = document.getElementById("comments-section");
    commentsSection.innerHTML = "";

    if (querySnapshot.empty) {
      commentsSection.innerHTML =
        "<p>No comments yet. Be the first to comment!</p>";
      document.getElementById("comment-count").textContent = "0 comments";
      return;
    }

    // Update comment count
    document.getElementById("comment-count").textContent = `${
      querySnapshot.size
    } comment${querySnapshot.size !== 1 ? "s" : ""}`;

    // Display comments
    querySnapshot.forEach((doc) => {
      const comment = { id: doc.id, ...doc.data() };
      addCommentToDOM(comment);
    });
  } catch (error) {
    console.error("Error loading comments:", error);
    document.getElementById("comments-section").innerHTML =
      "<p>Error loading comments. Please refresh the page.</p>";
  }
}

async function postComment(commentText) {
  if (!currentUser) {
    Swal.fire({
      title: "Please login to post comments",
      icon: "warning",
      iconColor: "#20462f",
      showConfirmButton: true,
      confirmButtonText: "Okay",
      background: "#D29F80",
      color: "#20462f",
      confirmButtonColor: "#C09779",
      showClass: {
        popup: "animate__animated animate__fadeIn",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOut",
      },
    });
    return;
  }

  if (!commentText.trim()) {
    Swal.fire({
      title: "Comment cannot be empty",
      icon: "error",
      iconColor: "#20462f",
      showConfirmButton: true,
      confirmButtonText: "Okay",
      background: "#D29F80",
      color: "#20462f",
      confirmButtonColor: "#C09779",
      showClass: {
        popup: "animate__animated animate__shakeX",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOut",
      },
    });    
    return;
  }

  try {
    const commentRef = await addDoc(collection(db, "comments"), {
      storyId: currentStoryId,
      userId: currentUser.uid,
      userName: currentUser.displayName || "Anonymous",
      userPhoto: currentUser.photoURL || null,
      text: commentText,
      timestamp: serverTimestamp(),
    });

    // Get the newly added comment with its ID
    const commentDoc = await getDoc(commentRef);
    if (commentDoc.exists()) {
      // Add the comment to DOM immediately with the ID
      addCommentToDOM({ id: commentDoc.id, ...commentDoc.data() });

      // Update comment count
      const commentsSection = document.getElementById("comments-section");
      const commentCount = commentsSection.querySelectorAll(".comment").length;
      document.getElementById(
        "comment-count"
      ).textContent = `${commentCount} comment${commentCount !== 1 ? "s" : ""}`;
    }

    // Clear input
    document.getElementById("comment-input").value = "";
    document.getElementById("post-comment").classList.remove("active");

    Swal.fire({
      title: "Comment posted successfully!",
      icon: "success",
      iconColor: "#20462f",
      showConfirmButton: false,
      timer: 1500,
      background: "#D29F80",
      color: "#20462f",
      showClass: {
        popup: "animate__animated animate__fadeIn",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOut",
      },
    });    
  } catch (error) {
    console.error("Error posting comment:", error);
    Swal.fire({
      title: "Failed to post comment",
      text: "Please try again later.",
      icon: "error",
      iconColor: "#20462f",
      confirmButtonText: "Okay",
      background: "#D29F80",
      color: "#20462f",
      confirmButtonColor: "#C09779",
      showClass: {
        popup: "animate__animated animate__shakeX",
      },
    });    
  }
}

window.onload = fetchStoryDetails;

document.addEventListener("DOMContentLoaded", () => {
  // Add translation button event listener
  // Replace the existing translation button event listener with this:
  document
    .getElementById("translate-toggle")
    .addEventListener("change", toggleTranslation);

  // Reaction Handling
  const likeBtn = document.querySelector(".like-btn");
  const reactionOptions = document.querySelector(".reaction-options");
  let isReactionOpen = false;
  let lastClickTime = 0;
  const doubleClickDelay = 300; // milliseconds between clicks to count as double click
  let clickTimeout;

  function toggleReactions(show) {
    if (show) {
      reactionOptions.classList.add("show");
      isReactionOpen = true;
    } else {
      reactionOptions.classList.remove("show");
      isReactionOpen = false;
    }
  }

  function handleSingleClick() {
    // Only show reactions if not already open
    if (!isReactionOpen) {
      toggleReactions(true);
    }
  }

  function handleDoubleClick() {
    // Clear any pending single click timeout
    clearTimeout(clickTimeout);
    // Close reactions if they were opened by the first click
    if (isReactionOpen) {
      toggleReactions(false);
    }
    // Perform like action
    handleReaction("like");
  }

  // Unified click handler for both mobile and desktop
  likeBtn.addEventListener("click", (e) => {
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTime;

    if (timeSinceLastClick < doubleClickDelay && timeSinceLastClick > 0) {
      // Double click detected
      handleDoubleClick();
      lastClickTime = 0;
    } else {
      // First click - wait to see if it becomes a double click
      lastClickTime = currentTime;
      clickTimeout = setTimeout(() => {
        // Only execute single click if no second click came
        handleSingleClick();
      }, doubleClickDelay);
    }
  });

  // Close reactions when clicking outside
  document.addEventListener("click", (e) => {
    if (!likeBtn.contains(e.target) && !reactionOptions.contains(e.target)) {
      toggleReactions(false);
    }
  });

  // Select a reaction from the options
  const reactionOptionsList = document.querySelectorAll(".reaction-option");
  reactionOptionsList.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      const reaction = option.dataset.reaction;
      handleReaction(reaction);
      toggleReactions(false);
    });
  });

  // Comment button
  document.querySelector(".comment-btn").addEventListener("click", () => {
    document.getElementById("comment-input").focus();
  });

  // Share button
  document.querySelector(".share-btn").addEventListener("click", async () => {
    // First try to use the Web Share API if available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.getElementById("story-title").textContent,
          text: "Check out this interesting story!",
          url: window.location.href,
        });
        return;
      } catch (err) {
        console.log("Web Share API not supported or share was cancelled", err);
        // Fall through to custom share dialog
      }
    }

    // Custom share dialog for browsers without Web Share API
    Swal.fire({
      title: "Share this story",
      html: `
        <div class="social-share-buttons">
          <button class="share-facebook" title="Share on Facebook">
            <i class="fab fa-facebook" style="color: #20462f;"></i>
          </button>
          <button class="share-twitter" title="Share on Twitter">
            <i class="fab fa-twitter" style="color: #20462f;"></i>
          </button>
          <button class="share-whatsapp" title="Share on WhatsApp">
            <i class="fab fa-whatsapp" style="color: #20462f;"></i>
          </button>
          <button class="share-linkedin" title="Share on LinkedIn">
            <i class="fab fa-linkedin" style="color: #20462f;"></i>
          </button>
          <button class="share-copy" title="Copy link">
            <i class="fas fa-link" style="color: #20462f;"></i>
          </button>
        </div>
      `,
      showConfirmButton: false,
      background: "#FF6F61",
      color: "#20462f",
      showClass: {
        popup: "animate__animated animate__fadeIn",
      },
    });    

    // Add event listeners for each share button
    document.querySelector(".share-facebook").addEventListener("click", () => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`;
      window.open(url, "_blank", "width=600,height=400");
      Swal.close();
    });

    document.querySelector(".share-twitter").addEventListener("click", () => {
      const text = `Check out this story: ${
        document.getElementById("story-title").textContent
      }`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(window.location.href)}`;
      window.open(url, "_blank", "width=600,height=400");
      Swal.close();
    });

    document.querySelector(".share-whatsapp").addEventListener("click", () => {
      const text = `Check out this story: ${
        document.getElementById("story-title").textContent
      } - ${window.location.href}`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
      Swal.close();
    });

    document.querySelector(".share-linkedin").addEventListener("click", () => {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        window.location.href
      )}`;
      window.open(url, "_blank", "width=600,height=400");
      Swal.close();
    });

    document.querySelector(".share-copy").addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        Swal.fire({
          title: "Link copied to clipboard!",
          icon: "success",
          iconColor: "#20462f",  // Added icon color
          showConfirmButton: false,
          timer: 1500,
          background: "#FF6F61",
          color: "#20462f",
          showClass: {
            popup: "animate__animated animate__fadeIn",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOut",
          },
        });        
      });
    });
  });
  // Comment handling (keep existing implementation)
  const postBtn = document.getElementById("post-comment");
  const commentInput = document.getElementById("comment-input");

  commentInput.addEventListener("input", () => {
    if (commentInput.value.trim() !== "") {
      postBtn.classList.add("active");
    } else {
      postBtn.classList.remove("active");
    }
  });

  postBtn.addEventListener("click", () => {
    const comment = commentInput.value.trim();
    postComment(comment);
  });

  commentInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      postComment(commentInput.value.trim());
    }
  });
});z
