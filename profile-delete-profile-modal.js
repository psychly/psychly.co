function showDeleteProfileModal() {
  // Assuming no validation needed for showing the delete modal, but you can add your own conditions here
  var container = document.getElementById('delete-profile-container');
  container.style.display = 'block'; // This will unhide the container
}

function hideDeleteProfileModal() {
  var container = document.getElementById('delete-profile-container');
  container.style.display = 'none'; // This will hide the container
}

function setupDeleteEventListeners() {
  document.getElementById('delete-profile-button').addEventListener('click', showDeleteProfileModal);

  var closeButtonsIds = ['delete-profile-close-button', 'delete-profile-back-button', 'delete-profile-confirm-button'];
  closeButtonsIds.forEach(function(buttonId) {
    var button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', hideDeleteProfileModal);
    }
  });
}

document.addEventListener('DOMContentLoaded', setupDeleteEventListeners);
