const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {recordSale, getSalesByDateRange, getTopBuyers } = require('../controllers/salesController');



// Routes for Sales
router.post('/',recordSale);
router.get('/sales-by-date-range', getSalesByDateRange)
router.get('/top-buyers', getTopBuyers)

module.exports = router;
