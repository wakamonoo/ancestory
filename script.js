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