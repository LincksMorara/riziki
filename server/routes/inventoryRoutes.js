const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
    addInventory,
    addBatch,
    getInventoryDetails,
    updateInventory,
    deleteInventory,
    getAllInventory,
    recordSale,
    getAllSales,
    getSalesByDateRange,
    getTopBuyers,
    getTopSellers
} = require('../controllers/inventoryController');

// Routes for Inventory
router.post('/add', protect, admin, addInventory);
router.post('/batch', protect, admin, addBatch);
router.get('/:name', protect, getInventoryDetails);
router.put('/:name', protect, admin, updateInventory);
router.delete('/:name', protect, admin, deleteInventory);
router.get('/', protect, getAllInventory);

// Routes for Sales
router.post('/sale', protect, recordSale);
router.get('/sales', protect, getAllSales);
router.get('/sales/date-range', protect, getSalesByDateRange);
router.get('/top-buyers', protect, getTopBuyers);
router.get('/top-sellers', protect, getTopSellers);

module.exports = router;
