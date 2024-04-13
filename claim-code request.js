// user requests a verification code
    document.addEventListener('DOMContentLoaded', function() {
        window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
            if (member) {
                let memberId = member.id;

                // Email verification button event listener
                document.getElementById('email-claim-button').addEventListener('click', function() {
                    var email = document.querySelector('.emailField').textContent;
                    sendVerificationRequest('/send-email-code', { email: email, memberId: memberId });
                });

                // SMS verification button event listener
                document.getElementById('sms-claim-button').addEventListener('click', function() {
                    var phone = document.querySelector('.phoneField').textContent;
                    sendVerificationRequest('/send-sms-code', { phone: phone, memberId: memberId });
                });

                // Phone call verification button event listener
                document.getElementById('call-claim-button').addEventListener('click', function() {
                    var phone = document.querySelector('.phoneField').textContent;
                    sendVerificationRequest('/send-call-code', { phone: phone, memberId: memberId });
                });
            }
        });
    });

    // Function to send a request to the Cloudflare Worker
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
            console.log('Success:', data);
            // Additional logic upon successful request
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

