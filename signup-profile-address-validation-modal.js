// Function to unhide the 'profile-address-valid-container'
  function unhideAddressContainer() {
    var container = document.getElementById('profile-address-valid-container');
    container.style.display = 'block'; // This will unhide the container
  }

  //Function to hide the 'profile-address-valid-container'
  function hideAddressContainer() {
    var container = document.getElementById('profile-address-valid-container');
    container.style.display = 'none'; // This will hide the container
  }

  // Event listeners setup function
  function setupEventListeners() {
    // Listener for 'confirm-address-button'
    document.getElementById('confirm-address-button').addEventListener('click', unhideAddressContainer);

    // Listeners for 'close-button' and 'close-button-back'
    var closeButtons = document.querySelectorAll('.close_button, .close-button-back');
    closeButtons.forEach(function(button) {
      button.addEventListener('click', hideAddressContainer);
    });

    // Listener for 'profile-save-address-button'
    var saveAddressButton = document.getElementById('profile-save-address-button');
    if (saveAddressButton) {
      saveAddressButton.addEventListener('click', function() {
        // Replace 'original-submit-button-id' with the actual ID or class of the MemberStack form's submit button
        var originalSubmitButton = document.getElementById('address-submit-button-hidden') || document.querySelector('.original-submit-button-class');
        if (originalSubmitButton) {
          originalSubmitButton.click(); // Simulate a click on the original submit button
        }

        // Hide the container
        hideAddressContainer();
      });
    }
  }

  // Set up event listeners once the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', setupEventListeners);
