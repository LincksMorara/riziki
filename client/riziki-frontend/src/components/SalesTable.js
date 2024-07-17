import React, { useState } from 'react';
import Pagination from 'react-js-pagination';

const SalesTable = ({ salesData }) => {
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = salesData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <div>
      <h2>Sales Data</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Buyer</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Value</th> {/* New column for total value */}
          </tr>
        </thead>
        <tbody>
          {currentSales.map((sale) => (
            <tr key={sale._id}>
              <td>{new Date(sale.date).toLocaleDateString()}</td>
              <td>{sale.buyer}</td>
              <td>{sale.quantity}</td>
              <td>{sale.price}</td>
              <td>{sale.quantity * sale.price}</td> {/* Calculate and display total value */}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={salesData.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default SalesTable;
