function openLoginModal() {
  document.getElementById("loginModal").style.display = "block";
}
function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}
document
  .getElementById("login-link")
  .addEventListener("click", function (event) {
    event.preventDefault();
    openLoginModal();
  });