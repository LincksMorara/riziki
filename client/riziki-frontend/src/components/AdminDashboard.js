import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiStockFill, RiShoppingCart2Line, RiMoneyDollarCircleFill, RiFileListLine, RiUserAddLine, RiEdit2Line, RiLogoutCircleLine } from 'react-icons/ri'; // Import icons
import BusinessOverview from './BusinessOverview';
import DateRangeSelector from './DateRangeSelector';
import ProfitVsExpensesPieChart from './ProfitVsExpensesPieChart';
import ProfitVsExpensesLineChart from './ProfitVsExpensesLineChart';
import './AdminDashboard.css'; // Import custom styles for AdminDashboard

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [customData, setCustomData] = useState({
    sales: { totalRevenue: 0, totalQuantity: 0 },
    expenses: { totalAmount: 0 },
    purchases: { totalAmount: 0, totalQuantity: 0 },
    startDate: '',
    endDate: '',
  });
  const [showDateRangeSelector, setShowDateRangeSelector] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period === 'custom') {
      setShowDateRangeSelector(true);
    } else {
      setShowDateRangeSelector(false);
      setCustomData({
        sales: { totalRevenue: 0, totalQuantity: 0 },
        expenses: { totalAmount: 0 },
        purchases: { totalAmount: 0, totalQuantity: 0 },
        startDate: '',
        endDate: '',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        {user && <p>Welcome, {user.username}</p>}
        <div className="header-links">
          <Link to="/inventory" className="admin-action">
            <RiStockFill className="icon" />
            Inventory
          </Link>
          <Link to="/new-sale" className="admin-action">
            <RiShoppingCart2Line className="icon" />
            Make Sale
          </Link>
          <Link to="/new-expense" className="admin-action">
            <RiMoneyDollarCircleFill className="icon" />
            Expenses
          </Link>
          <Link to="/new-purchase" className="admin-action">
            <RiShoppingCart2Line className="icon" />
            New Purchase
          </Link>
          <Link to="/create-user" className="admin-action">
            <RiUserAddLine className="icon" />
            Create User
          </Link>
          <Link to="/edit-profile" className="admin-action">
            <RiEdit2Line className="icon" />
            Edit Profile
          </Link>
          <Link to="/" onClick={handleLogout} className="logout-link">
            <RiLogoutCircleLine className="icon" />
            Logout
          </Link>
        </div>
      </div>
      <div className="admin-content">
        <BusinessOverview onPeriodChange={handlePeriodChange} setCustomData={setCustomData} />
        {showDateRangeSelector && <DateRangeSelector setCustomData={setCustomData} />}
        {selectedPeriod === 'custom' && customData.sales.totalRevenue > 0 && (
          <div className="card">
            <h3>Custom Date Range Revenue</h3>
            <p>Total Revenue: {customData.sales.totalRevenue}</p>
            <p>Total Quantity: {customData.sales.totalQuantity}</p>
          </div>
        )}
        <div className="chart-container">
          <div className="pie-chart-container">
            <ProfitVsExpensesPieChart startDate={customData.startDate} endDate={customData.endDate} />
          </div>
          <ProfitVsExpensesLineChart startDate={customData.startDate} endDate={customData.endDate} period={selectedPeriod} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
