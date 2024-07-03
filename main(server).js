document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const resetForm = document.getElementById('resetForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const newPasswordForm = document.getElementById('newPasswordForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Register Form Handling
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, phone, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    if (response.status === 201) {
                        window.location.href = '/Clients/html/login.html'; // Updated redirect path
                    }
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('An error occurred:', error);
                alert('An error occurred while trying to register. Please try again.');
            }
        });
    }

    // Login Form Handling
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/Clients/html/dashboard.html'; // Updated redirect path
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('An error occurred:', error);
                alert('Failed to login. Please check your network connection and try again.');
            }
        });
    }

    // Reset Form Handling
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;

            try {
                const response = await fetch('/api/auth/forgotpassword', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();
                console.log('Reset response:', data); // Debugging line

                if (response.ok) {
                    alert('Please check your email for the reset code');
                    window.location.href = '/Clients/html/forgotPassword.html'; // Updated redirect path
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('An error occurred:', error);
                alert('An error occurred while trying to request a password reset. Please try again.');
            }
        });
    }

    // Forgot Password Form Handling
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const resetCode = document.getElementById('resetCode').value;
            const email = document.getElementById('email').value; // Ensure email is captured

            try {
                const response = await fetch('/api/auth/validateresettoken', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, resetCode }),
                });

                const data = await response.json();
                if (response.ok) {
                    window.location.href = '/Clients/html/resetPassword.html'; // Updated redirect path
                } else {
                    alert('Invalid reset code');
                }
            } catch (error) {
                console.error('An error occurred:', error);
                alert('An error occurred. Check the console for more details.');
            }
        });
    }

    // New Password Form Handling
    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword === confirmPassword) {
                try {
                    const response = await fetch('/api/auth/resetpassword', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ newPassword }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        alert('Password reset successfully');
                        window.location.href = '/Clients/html/login.html'; // Updated redirect path
                    } else {
                        alert('Error: ' + data.error);
                    }
                } catch (error) {
                    console.error('An error occurred:', error);
                    alert('Failed to reset password. Please try again.');
                }
            } else {
                alert('Passwords do not match');
            }
        });
    }

    // Logout Button Handling
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('token');
                window.location.href = '/Clients/html/login.html'; // Updated redirect path
            }
        });
    }
});
