//verify code input by user and give access to listing and redirect to profile
document.addEventListener('DOMContentLoaded', function() {
  // Extract itemId from URL
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('itemId');

  window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
    if (member) {
      const webflowCmsId = member.customFields['webflow-cms-id'];

      // Email Verification Form Submission
      document.getElementById('email-verify-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var memberId = member.id;
        var code = document.getElementById('email-verify-input').value;
        console.log('Sending email verification request with Item ID:', itemId);
        sendVerificationRequest('/verify-email-code', { code: code, memberId: memberId, itemId: itemId, webflowCmsId: webflowCmsId });
      });

      // SMS Verification Form Submission
      document.getElementById('sms-verify-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var memberId = member.id;
        var phoneNumber = document.querySelector('.phoneField').textContent;
        var code = document.getElementById('sms-verify-input').value;
        console.log('Sending SMS verification request with Item ID:', itemId);
        sendVerificationRequest('/verify-sms-code', { code: code, memberId: memberId, phoneNumber: phoneNumber, itemId: itemId, webflowCmsId: webflowCmsId });
      });

      // Call Verification Form Submission
      document.getElementById('call-verify-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var memberId = member.id;
        var phoneNumber = document.querySelector('.phoneField').textContent;
        var code = document.getElementById('call-verify-input').value;
        console.log('Sending call verification request with Item ID:', itemId);
        sendVerificationRequest('/verify-call-code', { code: code, memberId: memberId, phoneNumber: phoneNumber, itemId: itemId, webflowCmsId: webflowCmsId });
      });
    }
  });

  function sendVerificationRequest(endpoint, data) {
    fetch('https://psychly-claim-send-verify-code.tobcsmith.workers.dev' + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if (data.verified) {
        console.log('Verification successful:', data.message);
        // Show the success screen
        // Dispatch a custom event to trigger the success screen
        const event = new CustomEvent('claimSuccess');
        document.dispatchEvent(event);
        // Redirect to the profile page after a 3-second delay
        setTimeout(function() {
          window.location.href = '/user-profile-management'; // Replace with the actual profile page URL
        }, 3000);
      } else {
        console.log('Verification failed:', data.message);
        // Check if the response message indicates incorrect code
        if (data.message === 'Email Verification Failed' || data.message === 'Phone Number Verification Failed') {
          // Notify the user that the code was incorrect
          alert('Incorrect Code: Please try again.');
          // Refresh the page after the alert
          setTimeout(function() {
            location.reload();
          }, 0);
        } else {
          // Logic for other failed verification cases
          // ...
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
});
