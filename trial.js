// Function to handle back button click
const navigateBack = () => {
    window.location.href = 'linkboard.html'; // Redirect to linkboard.html
};

// Fetch user profile data from server
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/user-profile') // Replace with your endpoint to fetch user data
        .then(response => response.json())
        .then(data => {
            document.getElementById('user-name').innerText = data.username;
            document.getElementById('user-email').innerText = `Email: ${data.email}`;
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
            // Handle error, show error message to user if needed
        });
});

// Function to handle profile image upload
const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file from the input
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imgElement = document.getElementById('profile-img');
        imgElement.src = e.target.result; // Update profile image preview
    }
    reader.readAsDataURL(file);

    // Simulate upload delay
    setUploading(true); // Set uploading state
    document.getElementById('upload-status').style.display = 'block'; // Show upload status

    setTimeout(() => {
        // Simulate successful upload
        console.log('Image uploaded successfully.');
        setUploading(false); // Reset uploading state
        document.getElementById('upload-status').style.display = 'none'; // Hide upload status
        document.getElementById('file-upload').value = ''; // Clear file upload input
    }, 1500);

    // In a real application, you would typically send the file to a server here
    const formData = new FormData();
    formData.append('profileImage', file);

    fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Image uploaded successfully:', data);
        // Handle response from server if needed
        setUploading(false); // Reset uploading state
        document.getElementById('upload-status').style.display = 'none'; // Hide upload status
    })
    .catch(error => {
        console.error('Error uploading image:', error);
        setUploadError('Error uploading image. Please try again.');
        setUploading(false); // Reset uploading state
        document.getElementById('upload-error').innerText = uploadError; // Display upload error message
        document.getElementById('upload-status').style.display = 'none'; // Hide upload status
    });
};

// Function to handle password change
const handleChangePassword = () => {
    // Example: Prompt user for new password
    const newPassword = prompt('Enter your new password:');
    
    // Validate the new password
    if (!newPassword || newPassword.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    // Example: Send request to server to change password
    fetch('/api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Password changed successfully.');
            // Optionally update UI or show success message
        } else {
            throw new Error('Failed to change password.');
        }
    })
    .catch(error => {
        console.error('Error changing password:', error.message);
        // Handle error, show error message to user
        alert('Failed to change password. Please try again later.');
    });
};

// Function to handle primary email address change
const handleChangePrimaryEmailAddress = () => {
    // Example: Prompt user for new email address
    const newEmailAddress = prompt('Enter your new email address:');
    
    // Validate the new email address (example: basic format check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmailAddress || !emailRegex.test(newEmailAddress)) {
        alert('Invalid email address format.');
        return;
    }
    
    // Example: Send request to server to change email address
    fetch('/api/change-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEmailAddress }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Email address changed successfully.');
            // Optionally update UI or show success message
        } else {
            throw new Error('Failed to change email address.');
        }
    })
    .catch(error => {
        console.error('Error changing email address:', error.message);
        // Handle error, show error message to user
        alert('Failed to change email address. Please try again later.');
    });
};

// Function to handle payment options update
const handleUpdatePaymentOptions = () => {
    // Redirect to paypal.html
    window.location.href = 'paypal.html';
};

// State variables (simulating React hooks)
let selectedFile = null;
let uploading = false;
let uploadError = null;

const setUploading = (value) => {
    uploading = value;
    // Update UI to indicate uploading state if needed
    document.getElementById('upload-status').style.display = value ? 'block' : 'none';
};

const setUploadError = (errorMessage) => {
    uploadError = errorMessage;
    // Update UI to display upload error message if needed
    document.getElementById('upload-error').innerText = errorMessage;
};

// Event listener for file upload input
document.getElementById('file-upload').addEventListener('change', handleImageUpload);
