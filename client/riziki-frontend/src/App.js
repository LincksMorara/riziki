// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard'; // Import UserDashboard
import NewSaleForm from './components/NewSaleForm';
import NewExpenseForm from './components/NewExpenseForm';
import NewPurchaseForm from './components/NewPurchaseForm';
import SignIn from './components/SignIn';
import CreateUser from './components/CreateUser';
import EditProfile from './components/EditUser';
import InventoryList from 'components/inventoryList';
import LandingPage from 'components/LandingPage';
import SignUp from './components/SignUp'; // Import SignUp
const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"  element={<SignIn setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} /> {/* Signup Page Route */}
          <Route path="/admin" element={<AdminDashboard user={user} />} />
          <Route path="/user" element={<UserDashboard user={user} />} /> {/* Route for UserDashboard */}
          <Route path="/new-sale" element={<NewSaleForm />} />
          <Route path="/new-expense" element={<NewExpenseForm />} />
          <Route path="/new-purchase" element={<NewPurchaseForm />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/edit-profile" element={<EditProfile user={user} />} />
          <Route path="/inventory" element={<InventoryList />} /> {/* Route for InventoryList */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
