document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('itemId');

  // Replace with your actual Cloudflare Worker URL
  const workerEndpoint = `https://psychly-claim.tobcsmith.workers.dev/?itemId=${itemId}`;

  var divBlockEmail = document.querySelector('.div-block-email');
  var divBlockText = document.querySelector('.div-block-text');
  var divBlockCall = document.querySelector('.div-block-call');

  function validateFields(email, phone) {
    if (!email || (typeof email === 'string' && email.trim() === '')) {
      divBlockEmail.style.display = 'none';
    } else {
      divBlockEmail.style.display = 'block';
    }

    if (!phone || (typeof phone === 'string' && phone.trim() === '')) {
      divBlockText.style.display = 'none';
      divBlockCall.style.display = 'none';
    } else {
      divBlockText.style.display = 'block';
      divBlockCall.style.display = 'block';
    }
  }

  fetch(workerEndpoint)
    .then(response => response.json())
    .then(data => {
      var email = data.email;
      var phone = data.phone;

      // Format the phone number to E.164 format
      if (phone && typeof phone === 'string') {
        phone = '+' + phone.replace(/\D/g, '');
      }

      // Populate all elements with the 'emailField' class
      document.querySelectorAll('.emailField').forEach(el => el.textContent = email || '');

      // Populate all elements with the 'phoneField' class
      document.querySelectorAll('.phoneField').forEach(el => el.textContent = phone || '');

      // Validate fields and hide/show divs
      validateFields(email, phone);
    })
    .catch(error => console.error('Error:', error));
});
