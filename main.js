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

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, phone, password }),
            });

            const data = await response.json();
            alert(data.message);
            if (response.status === 201) {
                window.location.href = 'login.html';
            }
        });
    }

    // Login Form Handling
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
            if (response.status === 200) {
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message);
            }
        });
    }

    // Reset Form Handling
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
            console.log('Reset response:', data); // Debugging line

            if (response.status === 200) {
                alert('Please check your email for the reset code');
                window.location.href = 'forgotPassword.html';
            }
        });
    }

    // Forgot Password Form Handling
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const resetCode = document.getElementById('resetCode').value;
            const email = document.getElementById('email').value; // Ensure email is captured

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

    // New Password Form Handling
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

    // Logout Button Handling
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            }
        });
    }
});
