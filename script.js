// ******************** CHANGE NAV COLOR UPON SCROLL ******************* //
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

// ******************** UPDATE CAROUSEL FUNCTION ******************* //

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

setInterval(nextSlide, 3000);

function openmenu() {
  document.getElementById("sidemenu").style.right = "0";
  document.querySelector(".fa-bars").style.display = "none";
  document.querySelector(".fa-times").style.display = "block";
}

// ******************** CLOSE AND TOGGLE THE SIDE NAV MENU ******************* //
function closemenu() {
  document.getElementById("sidemenu").style.right = "-200px";
  document.querySelector(".fa-bars").style.display = "block";
  document.querySelector(".fa-times").style.display = "none";
}

// ******************** MANUAL SWIPE FOR CAROUSEL ******************* //

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
