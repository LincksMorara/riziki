import React, { useState } from 'react';
import BusinessOverview from './BusinessOverview';
import DateRangeSelector from './DateRangeSelector';
import ProfitVsExpensesPieChart from './ProfitVsExpensesPieChart';
import ProfitVsExpensesLineChart from './ProfitVsExpensesLineChart';
import NewSaleForm from './NewSaleForm';
import NewExpenseForm from './NewExpenseForm';
import NewPurchaseForm from './NewPurchaseForm';

const AdminDashboard = () => {
  const [customData, setCustomData] = useState({
    sales: { totalRevenue: 0, totalQuantity: 0 },
    expenses: { totalAmount: 0 },
    purchases: { totalAmount: 0, totalQuantity: 0 },
    startDate: '',
    endDate: '',
  });
  const [showDateRangeSelector, setShowDateRangeSelector] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

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

  return (
    <div>
      <BusinessOverview onPeriodChange={handlePeriodChange} setCustomData={setCustomData} />
      {showDateRangeSelector && <DateRangeSelector setCustomData={setCustomData} />}
      {customData.sales.totalRevenue > 0 && (
        <div>
          <div className="card">
            <h3>Custom Date Range Revenue</h3>
            <p>Total Revenue: {customData.sales.totalRevenue}</p>
            <p>Total Quantity: {customData.sales.totalQuantity}</p>
          </div>
        </div>
      )}
      <ProfitVsExpensesPieChart startDate={customData.startDate} endDate={customData.endDate} />
      <ProfitVsExpensesLineChart startDate={customData.startDate} endDate={customData.endDate} period={selectedPeriod} />
      <NewSaleForm />
      <NewExpenseForm />
      <NewPurchaseForm />
    </div>
  );
};

export default AdminDashboard;
