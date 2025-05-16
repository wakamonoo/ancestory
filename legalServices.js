const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");

function showModal(type) {
  let content = "";

  if (type === "privacy") {
    content = ` 
      <div class="modal-ancestory-content">
        <h2>Privacy Policy</h2>
        <p>Last updated: April 30, 2025</p>
        <p>Ancestory is committed to protecting your privacy. When you log in via Email or Google, we collect only the following data:</p>
        <ul>
          <li>Your full name</li>
          <li>Email address</li>
          <li>Profile photo</li>
        </ul>
        <p>This information is used exclusively for:</p>
        <ul>
          <li>Account authentication and access</li>
          <li>Personalizing your experience</li>
          <li>Managing account features and support</li>
        </ul>
        <p>We do not sell, share, or trade your personal data with third parties. All information remains securely within our system and is never used for advertising or third-party profiling.</p>
        <p>You have the right to request data deletion at any time.</p>
        <p><strong>Contact:</strong> <a href="mailto:joven.serdanbataller21@gmail.com">joven.serdanbataller21@gmail.com</a></p>
        <p><strong>Website:</strong> <a href="https://jovenbataller21.vercel.app" target="_blank">jovenbataller21.vercel.app</a></p>
      </div>`;
  } else if (type === "terms") {
    content = ` 
      <div class="modal-ancestory-content">
        <h2>Terms of Service</h2>
        <p>Last updated: April 30, 2025</p>
        <p>By accessing or using Ancestory, you agree to these Terms of Service:</p>
        <ul>
          <li>You must log in through a valid Email or Google account.</li>
          <li>You are responsible for any activity on your account.</li>
          <li>You may not use Ancestory for illegal, abusive, or disruptive behavior.</li>
          <li>We reserve the right to suspend or terminate accounts violating these terms.</li>
        </ul>
        <p>All content is owned by Ancestory or its contributors. You may not reuse content without permission.</p>
        <p>This service is provided "as is". We do not guarantee uninterrupted access and are not liable for any resulting damages.</p>
        <p>For questions or legal concerns, contact: <a href="mailto:joven.serdanbataller21@gmail.com">joven.serdanbataller21@gmail.com</a></p>
      </div>`;
  } else if (type === "deletion") {
    content = ` 
      <div class="modal-ancestory-content">
        <h2>Data Deletion Instructions</h2>
        <p>If you would like to delete your account and associated data from our website, please follow these steps:</p>
        <ol>
          <li>Open the website.</li>
          <li>Navigate to the <strong>"Me"</strong> section from the top navigation bar.</li>
          <li>Select <strong>"Delete Account"</strong>.</li>
        </ol>
        <p>This will permanently remove your account and all associated data from our servers.</p>
        <p>If you encounter any issues or require assistance, please contact us at: <a href="mailto:joven.serdanbataller21@gmail.com">joven.serdanbataller21@gmail.com</a></p>
      </div>`;
  }

  modalContent.innerHTML =
    content +
    `<button class="modal-close-custom" onclick="closeModal()">Close</button>`;
  modalOverlay.style.display = "flex";
}

function closeModal() {
  modalOverlay.style.display = "none";
  modalContent.innerHTML = `<button class="modal-close-custom" onclick="closeModal()">Close</button>`;
}
