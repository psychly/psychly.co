  document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('itemId');

    // Replace with your actual Cloudflare Worker URL
    const workerEndpoint = `https://psychly-claim.tobcsmith.workers.dev/?itemID=${itemId}`;

    fetch(workerEndpoint)
      .then(response => response.json())
      .then(data => {
        // Populate all elements with the 'emailField' class
        document.querySelectorAll('.emailField').forEach(el => el.textContent = data.email);
        // Populate all elements with the 'phoneField' class
        document.querySelectorAll('.phoneField').forEach(el => el.textContent = data.phone);
      })
      .catch(error => console.error('Error:', error));
  });
