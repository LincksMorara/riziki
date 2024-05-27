// The code is wrapped in a 'DOMContentLoaded' event listener to ensure that the HTML is fully loaded before the script runs
document.addEventListener('DOMContentLoaded', () => {
    // Get form and button elements from the DOM
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const resetForm = document.getElementById('resetForm');
    const newPasswordForm = document.querySelector('#newPasswordForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // If the register form exists, add an event listener for form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the form from submitting normally
            // Get the input values from the form
            const firstName = document.getElementById('firstname').value;
            const lastName = document.getElementById('lastname').value;
            const username = document.getElementById('username').value;
            const phoneNumber = document.getElementById('phonenumber').value;
            const email = document.getElementById('email').value;
            const role = document.getElementById('role').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Check if the passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return; // Exit the function if passwords do not match
            }

            try {
                // Send a POST request to the register API endpoint with the form data
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, phoneNumber, username, email, password, role }),
                });
            
                // Parse the response data
                const data = await response.json();
            
                // Check if the response was successful
                if (response.ok) {
                    // Show the response message
                    alert(data.message);
                    // If the registration was successful, redirect to the login page
                    if (response.status === 201) {
                        window.location.href = 'login.html';
                    }
                } else {
                    // If the server responded with an error, show the error message
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                // If an error occurred while sending the request, log the error and show an error message
                console.error('An error occurred:', error);
                alert('An error occurred while trying to register. Please try again.');
            }
        });
    }

    // If the login form exists, add an event listener for form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the form from submitting normally
            // Get the input values from the form
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Send a POST request to the login API endpoint with the form data
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
            
                // If the response is ok, parse the data
                if (response.ok) {
                    const data = await response.json();
                    // Store the token in local storage
                    localStorage.setItem('token', data.token);
                    // Redirect to the dashboard
                    window.location.href = 'dashboard.html';
                } else if (response.status === 401) {
                    // If the status code is 401, show a custom message
                    alert('Login failed. Please check your email and password.');
                } else {
                    // If the response is not ok, try to parse the data and show an alert
                    try {
                        const data = await response.json();
                        alert(data.message || 'Login failed. Please check your email and password.');
                    } catch (error) {
                        // If an error occurred when parsing the data, show a default message
                        alert('Login failed. Please check your email and password.');
                    }
                }
            } catch (error) {
                // If an error occurred while sending the request, log the error and show an error message
                console.error('An error occurred:', error);
                alert('Failed to login. Please check your network connection and try again.');
            }
        });
    }

    // If the reset password request form exists, add an event listener for form submission
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the form from submitting normally
            const email = document.getElementById('email').value; // Get the input value from the form
    
            try {
                // Send a POST request to the forgot password API endpoint with the email
                const response = await fetch('http://localhost:3000/api/auth/forgotpassword', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
    
                const data = await response.json(); // Parse the response data
                // Log the response data for debugging
                console.log('Reset response:', data);
    
                if (response.status === 200) {
                    // Store the email in local storage
                    localStorage.setItem('email', email);
    
                    // Show an alert and redirect to the forgot password page
                    alert('Please check your email for the reset code');
                    window.location.href = 'forgotPassword.html';
                } else {
                    // If the server responded with an error, show the error message
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                // If an error occurred while sending the request, log the error and show an error message
                console.error('An error occurred:', error);
                alert('An error occurred while trying to request a password reset. Please try again.');
            }
        });
    }


    // Get the forgot password form and the reset code input elements
const forgotPasswordForm = document.querySelector('#forgotPasswordForm');
const resetCodeInput = document.querySelector('#resetCode');

// If the forgot password form and reset code input exist, add an event listener for form submission
if (forgotPasswordForm && resetCodeInput) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the form from submitting normally
        const resetToken = resetCodeInput.value; // Get the input value from the form

        try {
            // Send a POST request to the validate reset token API endpoint with the reset token
            const response = await fetch('http://localhost:3000/api/auth/validateresettoken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetToken }), // Removed email from the body as it's not needed
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const data = await response.json(); // Parse the response data
            console.log(`Response: ${JSON.stringify(data)}`);

            // Check if the response indicates success
            if (data.success) {
                // Store the reset token in local storage
                localStorage.setItem('resetToken', resetToken);

                // Redirect to the reset password page
                window.location.href = 'resetPassword.html';
            } else {
                // Show an error message if the token is invalid or expired
                alert('Invalid or expired reset token.');
            }
        } catch (error) {
            // If an error occurred while sending the request, log the error and show an error message
            console.error('An error occurred:', error);
            alert('An error occurred. Check the console for more details.');
        }
    });
}

    // If the new password form exists, add an event listener for form submission
if (newPasswordForm) {
    newPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the form from submitting normally
        const newPassword = document.getElementById('newPassword').value; // Get the input value from the form
        const confirmPassword = document.getElementById('confirmPassword').value; // Get the input value from the form
        const resetToken = localStorage.getItem('resetToken'); // Retrieve the reset token from local storage

        console.log('Reset Token:', resetToken); // Log the reset token for debugging
        console.log('New Password:', newPassword); // Log the new password for debugging

        if (newPassword === confirmPassword) {
            try {
                // Send a PUT request to the reset password API endpoint with the new password and reset token
                const response = await fetch('http://localhost:3000/api/auth/resetpassword', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resetToken, newPassword }), // Send resetToken and newPassword in the body
                });

                console.log('Response Status:', response.status); // Log the response status

                const data = await response.json(); // Parse the response data
                console.log('Response Data:', data); // Log the response data for debugging

                if (response.ok && data.success) {
                    alert('Password reset successfully');
                    window.location.href = 'login.html';
                } else {
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                // If an error occurred while sending the request, log the error and show an error message
                console.error('An error occurred:', error);
                alert('Failed to reset password. Please try again.');
            }
        } else {
            alert('Passwords do not match');
        }
    });
}

    // If the logout button exists, add an event listener for click events
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Confirm the user wants to logout
            if (confirm('Are you sure you want to logout?')) {
                // Remove the token from local storage and redirect to the login page
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            }
        });
    }
});
