let currentIndex = 0;
const carousel = document.getElementById("carousel");
const buttons = document.querySelectorAll(".buttons button");

function updateCarousel() {
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  buttons.forEach((btn, index) => {
    btn.classList.toggle("active", index === currentIndex);
  });
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % 3;
  updateCarousel();
}

setInterval(nextSlide, 3000); // Auto-scroll every 3 seconds

// Hamburger menu functions
function openmenu() {
  document.getElementById("sidemenu").style.right = "0";
  document.querySelector(".fa-bars").style.display = "none"; // Hide hamburger
  document.querySelector(".fa-times").style.display = "block"; // Show close button
}

function closemenu() {
  document.getElementById("sidemenu").style.right = "-200px";
  document.querySelector(".fa-bars").style.display = "block"; // Show hamburger
  document.querySelector(".fa-times").style.display = "none"; // Hide close button
}

// Manual scroll for mobile and PC
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchStartX - touchEndX > 50) {
    nextSlide(); // Swipe left
  } else if (touchEndX - touchStartX > 50) {
    currentIndex = (currentIndex - 1 + 3) % 3; // Swipe right
    updateCarousel();
  }
});

// For PC: Mouse drag event
let mouseDown = false;
let mouseStartX = 0;

carousel.addEventListener('mousedown', (e) => {
  mouseDown = true;
  mouseStartX = e.clientX;
});

carousel.addEventListener('mouseup', (e) => {
  if (mouseDown) {
    const mouseEndX = e.clientX;
    if (mouseStartX - mouseEndX > 50) {
      nextSlide(); // Drag left
    } else if (mouseEndX - mouseStartX > 50) {
      currentIndex = (currentIndex - 1 + 3) % 3; // Drag right
      updateCarousel();
    }
    mouseDown = false;
  }
});

carousel.addEventListener('mouseleave', () => {
  mouseDown = false; // Prevent drag events when mouse leaves
});
