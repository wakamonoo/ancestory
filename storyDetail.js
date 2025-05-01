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
import { StorySpeechSynthesis } from "./speechSynthesis.js";

const firebaseConfig = {
  apiKey: "AIzaSyAy4tekaIpT8doUUP0xA2oHeI9n6JgbybU",
  authDomain: "ancestory-c068e.firebaseapp.com",
  databaseURL:
    "https://ancestory-c068e-default-rtdb.asia-southeast1.firebasedatabase.app",
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

// ******************** INITIALLIZE SPEECH SYNTHESIS ******************* //

document.addEventListener("DOMContentLoaded", () => {
  if ("speechSynthesis" in window) {
    speechSynthesizer = new StorySpeechSynthesis();

    speechSynthesizer.onSpeechEnd = onSpeechEnd;
    speechSynthesizer.onSpeechError = onSpeechError;
    speechSynthesizer.onWordBoundary = highlightSpokenWord;

    setupSpeechUI();
  } else {
    document.getElementById("speak-btn").style.display = "none";
    console.warn("Speech synthesis not supported");
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

// ******************** FETCH STORY DETAILS FROM FIRESTORE ******************* //

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

// ******************** SPEECH FUNCTIONS ******************* //

function setupSpeechUI() {
  const speakBtn = document.getElementById("speak-btn");
  const stopBtn = document.getElementById("stop-speech-btn");

  speakBtn.replaceWith(speakBtn.cloneNode(true));
  stopBtn.replaceWith(stopBtn.cloneNode(true));

  document.getElementById("speak-btn").addEventListener("click", toggleSpeech);
  document
    .getElementById("stop-speech-btn")
    .addEventListener("click", stopSpeech);

  document
    .getElementById("voice-select-modal")
    .addEventListener("change", (e) => {
      speechSynthesizer.changeVoice(
        e.target.selectedOptions[0].getAttribute("data-name")
      );
    });

  document
    .getElementById("rate-control-modal")
    .addEventListener("input", (e) => {
      const rate = parseFloat(e.target.value);
      speechSynthesizer.changeRate(rate);
      document.getElementById("rate-value").textContent = `${rate.toFixed(1)}x`;
    });

  document
    .getElementById("apply-speech-options")
    .addEventListener("click", () => {
      closeModal();
      startReadingStory();
    });

  document.querySelector(".close-modal").addEventListener("click", closeModal);

  window.addEventListener("beforeunload", stopSpeech);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSpeech();
    }
  });
}


function toggleSpeech() {
  if (speechSynthesizer.isSpeaking) {
    speechSynthesizer.pauseSpeech();
    updateSpeechUI(false);
  } else {
    showCompatibilityAlert();
  }
}

function showCompatibilityAlert() {
  Swal.fire({
    title: "Important Notice!",
    text: "The voice model and text-highlighting features are optimized for desktop browsers. Some features may not work as expected on your device. You can change the TTS settings from your device's accessibility options for better experience.",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Proceed to Speech Options",
    cancelButtonText: "Cancel",
    background: "#D29F80",
    color: "#20462f",
    confirmButtonColor: "#C09779",
    cancelButtonColor: "#20462f",
  }).then((result) => {
    if (result.isConfirmed) {
      openModal();
    }
  });
}

function startReadingStory() {
  const title = document.getElementById("story-title").textContent;
  const origin = document
    .getElementById("story-origin")
    .textContent.replace("Origin:", "")
    .trim();
  const contentElement = document.getElementById("story-content");

  const contentClone = contentElement.cloneNode(true);
  contentElement.parentNode.replaceChild(contentClone, contentElement);
  contentClone.id = "story-content";

  try {
    speechSynthesizer.startSpeech(title, origin, contentClone);
    updateSpeechUI(true);
  } catch (error) {
    console.error("Error starting speech:", error);
    Swal.fire({
      title: "Voice Not Supported",
      text: "The selected voice is not supported on your device/browser. Please try a different voice.",
      icon: "error",
      iconColor: "#20462f",
      confirmButtonText: "Okay",
      background: "#D29F80",
      color: "#20462f",
      confirmButtonColor: "#C09779",
    }).then(() => {
      openModal();
    });
  }
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
  if (event.error !== "interrupted") {
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
  if (event.name !== "word") return;

  const charIndex = event.charIndex;
  const charLength = event.charLength;

  let element, adjustedIndex;

  if (charIndex < speechSynthesizer.titleLength) {
    element = document.getElementById("story-title");
    adjustedIndex = charIndex;
  } else if (
    charIndex <
    speechSynthesizer.titleLength + speechSynthesizer.originLength
  ) {
    element = document.getElementById("story-origin");
    adjustedIndex = charIndex - speechSynthesizer.titleLength;
  } else {
    element = document.getElementById("story-content");
    adjustedIndex =
      charIndex -
      (speechSynthesizer.titleLength + speechSynthesizer.originLength);
  }

  removeHighlighting();

  if (!element || !element.firstChild) return;

  const tempClone = element.cloneNode(true);

  try {
    const { node, position } = findTextNodeAndPosition(
      tempClone,
      adjustedIndex
    );

    if (node && position !== -1) {
      const range = document.createRange();
      range.setStart(node, position);
      range.setEnd(node, position + charLength);

      const span = document.createElement("span");
      span.className = "highlight-word";

      try {
        range.surroundContents(span);

        element.innerHTML = tempClone.innerHTML;

        const highlightedSpan = element.querySelector(".highlight-word");
        if (highlightedSpan) {
          scrollToHighlight(highlightedSpan);
        }
        return;
      } catch (e) {
        console.log("Modern highlighting failed, trying fallback");
      }
    }
  } catch (e) {
    console.log("Modern highlighting error:", e);
  }

  try {
    const textNodes = [];
    const walker = document.createTreeWalker(
      tempClone,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    let currentPos = 0;
    let foundNode = null;
    let foundPos = 0;

    for (const node of textNodes) {
      const nodeLength = node.textContent.length;
      if (currentPos + nodeLength > adjustedIndex) {
        foundNode = node;
        foundPos = adjustedIndex - currentPos;
        break;
      }
      currentPos += nodeLength;
    }

    if (foundNode) {
      const range = document.createRange();
      range.setStart(foundNode, foundPos);
      range.setEnd(foundNode, foundPos + charLength);

      const span = document.createElement("span");
      span.className = "highlight-word";

      range.surroundContents(span);
      element.innerHTML = tempClone.innerHTML;

      const highlightedSpan = element.querySelector(".highlight-word");
      if (highlightedSpan) {
        scrollToHighlight(highlightedSpan);
      }
    }
  } catch (e) {
    console.error("Fallback highlighting failed:", e);
  }
}

function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      }[tag])
  );
}

function findTextNodeAndPosition(element, charIndex) {
  if (!element) return { node: null, position: -1 };

  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let currentIndex = 0;
  let node;

  while ((node = walker.nextNode())) {
    const nodeLength = node.textContent.length;
    if (currentIndex + nodeLength > charIndex) {
      return {
        node: node,
        position: charIndex - currentIndex,
      };
    }
    currentIndex += nodeLength;
  }

  if (element.nodeType === Node.TEXT_NODE) {
    if (charIndex <= element.textContent.length) {
      return {
        node: element,
        position: charIndex,
      };
    }
  }

  return { node: null, position: -1 };
}

function scrollToHighlight(element) {
  const storyContainer = document.getElementById("storyContainer");
  const containerRect = storyContainer.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const elementTop = elementRect.top - containerRect.top;
  const elementBottom = elementRect.bottom - containerRect.top;
  const containerHeight = containerRect.height;

  if (elementTop < storyContainer.scrollTop) {
    storyContainer.scrollTop = elementTop - 20;
  } else if (elementBottom > storyContainer.scrollTop + containerHeight) {
    storyContainer.scrollTop = elementBottom - containerHeight + 20;
  }
}


function removeHighlighting() {
  const highlights = document.querySelectorAll(".highlight-word");
  highlights.forEach((highlight) => {
    const parent = highlight.parentNode;
    if (parent) {
      parent.replaceChild(
        document.createTextNode(highlight.textContent),
        highlight
      );
      parent.normalize();
    }
  });
}

function openModal() {
  const modal = document.getElementById("speech-options-modal");
  modal.style.display = "block";

  const voiceSelect = document.getElementById("voice-select-modal");
  voiceSelect.innerHTML = "";

  speechSynthesizer.getVoices().forEach((voice) => {
    const option = document.createElement("option");
    let displayName = voice.name;

    if (voice.name.toLowerCase().includes("angelo"))
      displayName = "Angelo (Filipino)";
    else if (voice.name.toLowerCase().includes("blessica"))
      displayName = "Blessica (Filipino)";
    else if (voice.name.toLowerCase().includes("andrew"))
      displayName = "Andrew (English)";
    else if (voice.name.toLowerCase().includes("emma"))
      displayName = "Emma (English)";

    option.textContent = displayName;
    option.setAttribute("data-name", voice.name);
    option.setAttribute("data-lang", voice.lang);

    if (displayName !== voice.name) {
      option.style.fontWeight = "bold";
    }

    voiceSelect.appendChild(option);

    if (voice === speechSynthesizer.getCurrentVoice()) {
      option.selected = true;
    }
  });

  const rateControl = document.getElementById("rate-control-modal");
  rateControl.value = speechSynthesizer.getCurrentRate();
  document.getElementById("rate-value").textContent = `${speechSynthesizer
    .getCurrentRate()
    .toFixed(1)}x`;
}

function closeModal() {
  document.getElementById("speech-options-modal").style.display = "none";
}

function updateSpeechUI(isSpeaking) {
  const speakBtn = document.getElementById("speak-btn");
  const stopBtn = document.getElementById("stop-speech-btn");

  if (isSpeaking) {
    speakBtn.style.display = "none";
    stopBtn.style.display = "flex";
    speakBtn.querySelector("span").textContent = "Pause";
  } else {
    speakBtn.style.display = "flex";
    stopBtn.style.display = "none";
    speakBtn.querySelector("span").textContent = "Listen";
  }
}

// ******************** FORMAT INTO SPACING THE <BR> ******************* //

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

// ******************** TRANSLATION FUNCTION ******************* //

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
    translateToggle.disabled = true;

    try {
      const docRef = doc(db, "Stories", currentStoryId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.filipino) {
          document.getElementById("story-title").innerText =
            originalContent.title;
          document.getElementById("story-origin").innerText =
            originalContent.origin;
          document.getElementById("story-content").innerHTML =
            formatStoryContent(data.filipino);
          isTranslated = true;
        } else {
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

// ******************** REACTION FUNCTION ******************* //

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
      const [type, count] = reactionEntries[0];
      const icon = createReactionIcon(type);
      reactionStatsElement.insertBefore(icon, likeCountElement);
      likeCountElement.textContent = `${count} ${getReactionDisplayName(type)}${
        count !== 1 ? "s" : ""
      }`;
    } else {
      sortedReactions.forEach(([type], index) => {
        const icon = createReactionIcon(type);
        reactionStatsElement.insertBefore(icon, likeCountElement);

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

// ******************** COMMENT FUNCTION ******************* //

async function deleteComment(commentId) {
  if (!currentUser) return;

  try {
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
      await deleteDoc(doc(db, "comments", commentId));

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

function addCommentToDOM(comment) {
  const commentEl = document.createElement("div");
  commentEl.className = "comment";
  commentEl.dataset.commentId = comment.id;

  const avatarContent = comment.userPhoto?.includes('users.png') 
  ? `<img src="images/email-user.png" alt="User Avatar" class="comment-avatar-img">`
  : comment.userPhoto 
    ? `<img src="${comment.userPhoto}" alt="User Avatar" class="comment-avatar-img">`
    : `<i class="fas fa-user-circle" style="font-size: 32px; color: #20462f;"></i>`;

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

    document.getElementById("comment-count").textContent = `${
      querySnapshot.size
    } comment${querySnapshot.size !== 1 ? "s" : ""}`;

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

    const commentDoc = await getDoc(commentRef);
    if (commentDoc.exists()) {
      addCommentToDOM({ id: commentDoc.id, ...commentDoc.data() });

      const commentsSection = document.getElementById("comments-section");
      const commentCount = commentsSection.querySelectorAll(".comment").length;
      document.getElementById(
        "comment-count"
      ).textContent = `${commentCount} comment${commentCount !== 1 ? "s" : ""}`;
    }

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

// ******************** EVENT LISTENERS ******************* //

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("translate-toggle")
    .addEventListener("change", toggleTranslation);

  const likeBtn = document.querySelector(".like-btn");
  const reactionOptions = document.querySelector(".reaction-options");
  let isReactionOpen = false;
  let lastClickTime = 0;
  const doubleClickDelay = 300;
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
    if (!isReactionOpen) {
      toggleReactions(true);
    }
  }

  function handleDoubleClick() {
    clearTimeout(clickTimeout);
    if (isReactionOpen) {
      toggleReactions(false);
    }
    handleReaction("like");
  }

  likeBtn.addEventListener("click", (e) => {
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTime;

    if (timeSinceLastClick < doubleClickDelay && timeSinceLastClick > 0) {
      handleDoubleClick();
      lastClickTime = 0;
    } else {
      lastClickTime = currentTime;
      clickTimeout = setTimeout(() => {
        handleSingleClick();
      }, doubleClickDelay);
    }
  });

  document.addEventListener("click", (e) => {
    if (!likeBtn.contains(e.target) && !reactionOptions.contains(e.target)) {
      toggleReactions(false);
    }
  });

  const reactionOptionsList = document.querySelectorAll(".reaction-option");
  reactionOptionsList.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      const reaction = option.dataset.reaction;
      handleReaction(reaction);
      toggleReactions(false);
    });
  });

  document.querySelector(".comment-btn").addEventListener("click", () => {
    document.getElementById("comment-input").focus();
  });

  // ******************** SHARE FUNCTION ******************* //

  document.querySelector(".share-btn").addEventListener("click", async () => {
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
      }
    }

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
          iconColor: "#20462f",
          showConfirmButton: false,
          timer: 1500,
          background: "#C09779",
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
});
