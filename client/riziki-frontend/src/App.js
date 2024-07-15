import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import NewSaleForm from './components/NewSaleForm';
import NewExpenseForm from './components/NewExpenseForm';
import NewPurchaseForm from './components/NewPurchaseForm';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/new-sale" element={<NewSaleForm />} />
          <Route path="/new-expense" element={<NewExpenseForm />} />
          <Route path="/new-purchase" element={<NewPurchaseForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
