function scrollToElement(elementId, offsetY = -window.innerHeight * 0.3) {
  const element = document.getElementById(elementId);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset + offsetY;
    window.scrollTo({top: y, behavior: 'smooth'});
  }
}

function checkValidation() {
  // Check if First Name is provided
  if (!document.getElementById('First-Name-4').value) {
    alert("Please add your First Name");
    scrollToElement('First-Name-4');
    return false;
  }

  // Check if Last Name is provided
  if (!document.getElementById('Last-Name-4').value) {
    alert("Please add your Last Name");
    scrollToElement('Last-Name-4');
    return false;
  }
  
  // Check if mental health role is selected
  if (!document.getElementById('mental-health-role-input').value) {
    alert("Please select your mental health role");
    scrollToElement('mental-health-role-input');
    return false;
  }

  if (!document.querySelector('#language-input input[type="checkbox"]:checked')) {
    alert("Please add at least one language");
    scrollToElement('language-input');
    return false;
  }

  // Check if Practice Name has at least 3 characters
  if (document.getElementById('practice-name').value.length < 3) {
    alert("Please add your Practice Name");
    scrollToElement('practice-name');
    return false;
  }

  // Check if a Practice Type is selected
  if (!document.getElementById('practice-type').value) {
    alert("Please add your Practice Type");
    scrollToElement('practice-type');
    return false;
  }

  // Check if a Practice License State is selected
  if (!document.getElementById('practice-license-state-1').value) {
    alert("Please add your Practice License State");
    scrollToElement('practice-license-state-1');
    return false;
  }

  // Check booking type
  if (!document.getElementById('booking-type-online').checked && !document.getElementById('booking-type-in-person').checked) {
    alert("Please add your booking type");
    scrollToElement('booking-type-online');
    return false;
  }

  // Check if at least one Patient Type is checked
  if (!document.querySelector('#patient-types input[type="checkbox"]:checked')) {
    alert("Please add at least one Patient Type");
    scrollToElement('patient-types');
    return false;
  }

  // Check if at least 40 words in ql-editor
  var editorText = document.querySelector('.ql-editor').innerText.trim();
  if (editorText.split(/\s+/).length < 10) {
    alert("Please elaborate on your practice description");
    scrollToElement('ql-editor-container'); // Assuming the container has an ID for positioning
    return false;
  }

  // Check if at least one Condition is checked
  if (!document.querySelector('#conditions input[type="checkbox"]:checked')) {
    alert("Please add at least one Condition");
    scrollToElement('conditions');
    return false;
  }

  // Check if at least one Type of Therapy is checked
  if (!document.querySelector('#type-of-therapy input[type="checkbox"]:checked')) {
    alert("Please add at least one Type of Therapy");
    scrollToElement('type-of-therapy');
    return false;
  }

  // Check if Practice Email or Practice Phone is provided
  const practiceEmail = document.getElementById('practice-main-email').value;
  const practicePhone = document.getElementById('practice-main-phone').value;
  if (!practiceEmail && !practicePhone) {
    alert("Please provide either a Practice Email or a Practice Phone for patients");
    scrollToElement('practice-main-email');
    return false;
  }

  // Validate Practice Email if provided
  if (practiceEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(practiceEmail)) {
      alert("Please add a valid Practice Email for patients");
      scrollToElement('practice-main-email');
      return false;
    }
  }

  // Validate image URL
  const imageUrlInput = document.getElementById('images-input-main').value;
  const urlPattern = /(http[s]?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;
  if (!urlPattern.test(imageUrlInput)) {
    alert("Please add your headshot or logo");
    scrollToElement('images-input-main');
    return false;
  }

  // Validate address fields
  const addressFields = ['address-auto', 'city-auto', 'state-auto', 'zipcode-auto', 'country-auto'];
  for (let fieldId of addressFields) {
    if (!document.getElementById(fieldId).value) {
      alert(`Please add your ${fieldId.replace('-auto', '').replace('-', ' ')}`);
      scrollToElement(fieldId);
      return false;
    }
  }

  // All checks passed
  return true;
}

function unhidePublishContainer() {
  if (checkValidation()) {
    // If validation passed, trigger the 'save-profile-info-button' click
    document.getElementById('save-profile-info-button').click();

    // Then, display the modal after a short delay to ensure any asynchronous actions tied to saving have completed
    setTimeout(function() {
      var container = document.getElementById('publish-profile-container');
      container.style.display = 'block'; // This will unhide the container
    }, 400); // Adjust delay as necessary based on your application's needs
  }
}

function hidePublishContainer() {
  var container = document.getElementById('publish-profile-container');
  container.style.display = 'none'; // This will hide the container
}

function setupPublishEventListeners() {
  var publishButtonIds = ['publish-full-profile-button', 'publish-full-profile-button-desktop'];
  publishButtonIds.forEach(function(buttonId) {
    var button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', unhidePublishContainer);
    }
  });

  var closeButtonsIds = ['publish-profile-confirm-button', 'publish-profile-back-button', 'publish-profile-close-button'];
  closeButtonsIds.forEach(function(buttonId) {
    var button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', hidePublishContainer);
    }
  });
}


document.addEventListener('DOMContentLoaded', setupPublishEventListeners);

