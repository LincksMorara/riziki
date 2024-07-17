const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Get revenue for a specific date
router.get('/revenue', protect, reportController.getRevenue);

// Get profit for a specific date
router.get('/profit', protect, reportController.getProfit);

// Get remaining stock as of a specific date
router.get('/stock', protect, reportController.getStock);

// Get top sellers within a date range
router.get('/top-sellers', protect, reportController.getTopSellers);

// Get top buyers within a date range
router.get('/top-buyers', protect, reportController.getTopBuyers);

module.exports = router;