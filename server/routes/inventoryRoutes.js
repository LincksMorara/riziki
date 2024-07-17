const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
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
    getTopSellers,
    addInventoryWithBatch,
    getBatchDetails,
    deleteItemsFromBatch,
    getBatchesByDateRange,
    getInventoryById
} = require('../controllers/inventoryController');

// Routes for Inventory
router.post('/', upload.single('image'), addInventoryWithBatch);
router.get('/', getInventoryDetails);
router.post('/batches', getBatchDetails);
router.delete('/batches', deleteItemsFromBatch);
router.put('/:name', protect, admin, updateInventory);
router.delete('/:name', protect, admin, deleteInventory);
router.get('/', protect, getAllInventory);
router.post('/getInventoryById', getInventoryById);

//Routes for purchases
router.get('/batches-by-date-range',getBatchesByDateRange);



// Routes for Sales
router.post('/sale', protect, recordSale);
router.get('/sales', protect, getAllSales);
router.get('/sales/date-range', protect, getSalesByDateRange);
router.get('/top-buyers', protect, getTopBuyers);
router.get('/top-sellers', protect, getTopSellers);

module.exports = router;
