import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DateRangeSelector from './DateRangeSelector';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [customData, setCustomData] = useState({
        sales: { totalRevenue: 0, totalQuantity: 0 },
        startDate: '',
        endDate: '',
    });
    const [showDateRangeSelector, setShowDateRangeSelector] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handlePeriodChange = (period) => {
        // Handle period change logic here if needed
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <div>
            <div className="dashboard-header">
                <h1>User Dashboard</h1>
                {user && <p>Welcome, {user.username}</p>}
                <div className="header-links">
                    <Link to={{ pathname: "/new-sale", state: { username: user?.username } }} className="admin-action">Make Sale</Link>
                    <Link to="/inventory" className="admin-action">Inventory</Link>
                    <Link to="/edit-profile" className="admin-action">Edit Profile</Link>
                    <Link to="/" onClick={handleLogout} className="logout-link">Logout</Link>
                </div>
            </div>
            {showDateRangeSelector && <DateRangeSelector setCustomData={setCustomData} />}
            {/* Other dashboard content */}
        </div>
    );
};

export default UserDashboard;
