const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {recordSale, getSalesByDateRange, getTopBuyers, getProfit } = require('../controllers/salesController');



// Routes for Sales
router.post('/',recordSale);
router.get('/sales-by-date-range', getSalesByDateRange)
router.get('/top-buyers', getTopBuyers)
router.get('/profit', getProfit)
module.exports = router;
