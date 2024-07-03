document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch user data from the database
    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/get-user-data'); // Adjust the endpoint as needed
            const userData = await response.json();
            
            if (userData) {
                document.getElementById('username').textContent = userData.username;
                document.getElementById('profile-img').src = userData.profileImage || 'profile-placeholder.png';
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Fetch user data on page load
    fetchUserData();
});
