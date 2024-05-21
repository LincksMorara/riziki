// The code is wrapped in a 'DOMContentLoaded' event listener to ensure that the HTML is fully loaded before the script runs
document.addEventListener('DOMContentLoaded', () => {
    // Get form and button elements from the DOM
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const resetForm = document.getElementById('resetForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const newPasswordForm = document.getElementById('newPasswordForm');
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
                return;
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

    // Similar to the register form, but for the login form
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            // If the login was successful, store the token in local storage and redirect to the dashboard
            if (response.status === 200) {
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message);
            }
        });
    }

    // Similar to the above, but for the password reset request form
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;

            const response = await fetch('/api/forgotpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            // Log the response data for debugging
            console.log('Reset response:', data);

            if (response.status === 200) {
                alert('Please check your email for the reset code');
                window.location.href = 'forgotPassword.html';
            }
        });
    }

    // For the form where the user enters the reset code they received
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const resetCode = document.getElementById('resetCode').value;
            const email = document.getElementById('email').value;

            const response = await fetch('/api/validateresettoken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, resetCode }),
            });

            const data = await response.json();
            if (response.status === 200) {
                window.location.href = 'resetPassword.html';
            } else {
                alert('Invalid reset code');
            }
        });
    }

    // For the form where the user enters their new password
    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword === confirmPassword) {
                alert('Password reset successfully');
                window.location.href = 'login.html';
            } else {
                alert('Passwords do not match');
            }
        });
    }

    // For the logout button
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