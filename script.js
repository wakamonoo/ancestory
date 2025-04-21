// Change the nav background color based on scroll position
window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");

  if (window.scrollY >= window.innerHeight) {
    nav.style.backgroundColor = "#F1D1B5";
  } else {
    nav.style.backgroundColor = "#D29F80";
  }
});

let currentIndex = 0;
const carousel = document.getElementById("carousel");
const buttons = document.querySelectorAll(".buttons button");

// Update the carousel position and active button
function updateCarousel() {
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  buttons.forEach((btn, index) => {
    btn.classList.toggle("active", index === currentIndex);
  });
}

// Navigate to a specific slide in the carousel
function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

// Move to the next slide in the carousel
function nextSlide() {
  currentIndex = (currentIndex + 1) % 3;
  updateCarousel();
}

// Automatically advance to the next slide every 3 seconds
setInterval(nextSlide, 3000);

// Open the side menu and toggle the menu icon
function openmenu() {
  document.getElementById("sidemenu").style.right = "0";
  document.querySelector(".fa-bars").style.display = "none";
  document.querySelector(".fa-times").style.display = "block";
}

// Close the side menu and toggle the menu icon
function closemenu() {
  document.getElementById("sidemenu").style.right = "-200px";
  document.querySelector(".fa-bars").style.display = "block";
  document.querySelector(".fa-times").style.display = "none";
}

// Manual swipe support for carousel on touch devices
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchStartX - touchEndX > 50) {
    nextSlide();
  } else if (touchEndX - touchStartX > 50) {
    currentIndex = (currentIndex - 1 + 3) % 3;
    updateCarousel();
  }
});
