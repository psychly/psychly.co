document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('itemId');

  // Replace with your actual Cloudflare Worker URL
  const workerEndpoint = `https://psychly-claim.tobcsmith.workers.dev/?itemId=${itemId}`;

  var div65 = document.querySelector('.Div65');
  var div35 = document.querySelector('.Div35');
  var div34 = document.querySelector('.Div34');

  function validateFields(email, phone) {
    if (!email.includes('@')) {
      div65.style.display = 'none';
    } else {
      div65.style.display = 'block';
    }

    if (!/\d/.test(phone)) {
      div35.style.display = 'none';
      div34.style.display = 'none';
    } else {
      div35.style.display = 'block';
      div34.style.display = 'block';
    }
  }

  fetch(workerEndpoint)
    .then(response => response.json())
    .then(data => {
      var email = data.email;
      var phone = data.phone;

      // Populate all elements with the 'emailField' class
      document.querySelectorAll('.emailField').forEach(el => el.textContent = email);
      // Populate all elements with the 'phoneField' class
      document.querySelectorAll('.phoneField').forEach(el => el.textContent = phone);

      // Validate fields and hide/show divs
      validateFields(email, phone);
    })
    .catch(error => console.error('Error:', error));
});
