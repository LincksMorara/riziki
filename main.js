function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
    });
}

window.addEventListener('scroll', function() {
    var toolsSection = document.getElementById('tools');
    var toolsList = document.querySelector('.tools_tool-list');

    if (toolsSection.getBoundingClientRect().top <= 0) {
        toolsList.classList.add('fixed-tools');
    } else {
        toolsList.classList.remove('fixed-tools');
    }

    var featureSections = document.querySelectorAll('.feature-section');

    featureSections.forEach(function(section) {
        var sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= window.innerHeight / 2 && sectionTop > -section.offsetHeight / 2) {
            var sectionId = section.getAttribute('id');
            var backgroundColor;
            switch (sectionId) {
                case 'accounting':
                    backgroundColor = '#E8FFF5'; // Accounting section background color (gold)
                    break;
                case 'data-analytics':
                    backgroundColor = '#87CEEB'; // Data Analytics section background color (sky blue)
                    break;
                case 'profit-loss':
                    backgroundColor = '#FF6347'; // Profit & Loss section background color (tomato)
                    break;
                case 'inventory':
                    backgroundColor = '#3C6D71'; // Inventory section background color (lime green)
                    break;
                default:
                    backgroundColor = 'white'; // Default background color
            }
            document.body.style.backgroundColor = backgroundColor;
        }
    });
});

document.getElementById('tax-time').addEventListener('click', function() {
    document.getElementById('perks-image').src = '/Clients/images/tax.webp'; // Updated image path
});

document.getElementById('time-saving').addEventListener('click', function() {
    document.getElementById('perks-image').src = '/Clients/images/Cashflow.png'; // Updated image path
});

document.getElementById('profitability').addEventListener('click', function() {
    document.getElementById('perks-image').src = '/Clients/images/profit.jpeg'; // Updated image path
});

const faqs = document.querySelectorAll('.faq-question');
faqs.forEach(faq => {
    faq.addEventListener('click', function() {
        const answer = document.getElementById('answer' + this.id.slice(-1));
        if (answer.style.display === 'block') {
            answer.style.display = 'none';
        } else {
            answer.style.display = 'block';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const resetForm = document.getElementById('resetForm');
    const newPasswordForm = document.querySelector('#newPasswordForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the form from submitting normally
            const firstName = document.getElementById('firstname').value;
            const lastName = document.getElementById('lastname').value;
            const username = document.getElementById('username').value;
            const phoneNumber = document.getElementById('phonenumber').value;
            const email = document.getElementById('email').value;
            const role = document.getElementById('role').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, phoneNumber, username, email, password, role }),
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

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    window.location.href = '/Clients/html/dashboard.html'; // Updated redirect path
                } else if (response.status === 401) {
                    alert('Login failed. Please check your email and password.');
                } else {
                    try {
                        const data = await response.json();
                        alert(data.message || 'Login failed. Please check your email and password.');
                    } catch (error) {
                        alert('Login failed. Please check your email and password.');
                    }
                }
            } catch (error) {
                console.error('An error occurred:', error);
                alert('Failed to login. Please check your network connection and try again.');
            }
        });
    }

    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/forgotpassword', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();
                console.log('Reset response:', data);

                if (response.status === 200) {
                    localStorage.setItem('email', email);
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

    const forgotPasswordForm = document.querySelector('#forgotPasswordForm');
    const resetCodeInput = document.querySelector('#resetCode');

    if (forgotPasswordForm && resetCodeInput) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const resetToken = resetCodeInput.value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/validateresettoken', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resetToken }),
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const data = await response.json();
                console.log(`Response: ${JSON.stringify(data)}`);

                if (data.success) {
                    localStorage.setItem('resetToken', resetToken);
                    window.location.href = '/Clients/html/resetPassword.html'; // Updated redirect path
                } else {
                    alert('Invalid or expired reset token.');
                }
            } catch (error) {
                console.error('An error occurred:', error);
                alert('An error occurred. Check the console for more details.');
            }
        });
    }

    const newPasswordForm = document.querySelector('#newPasswordForm');

    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const resetToken = localStorage.getItem('resetToken');

            console.log('Reset Token:', resetToken);
            console.log('New Password:', newPassword);

            if (newPassword === confirmPassword) {
                try {
                    const response = await fetch('http://localhost:3000/api/auth/resetpassword', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ resetToken, newPassword }),
                    });

                    console.log('Response Status:', response.status);

                    const data = await response.json();
                    console.log('Response Data:', data);

                    if (response.ok && data.success) {
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

    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('token');
                window.location.href = '/Clients/html/login.html'; // Updated redirect path
            }
        });
    }
});
