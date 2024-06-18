const Sale = require('../models/Sale');
const Batch = require('../models/Batch');
const User = require('../models/User');

// Get revenue for a specific date
exports.getRevenue = async (req, res) => {
    try {
        const { date } = req.query;
        const start = new Date(date);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const sales = await Sale.find({
            timestamp: { $gte: start, $lt: end }
        });

        const revenue = sales.reduce((acc, sale) => acc + sale.price, 0);

        res.status(200).json({ success: true, revenue });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get profit for a specific date
exports.getProfit = async (req, res) => {
    try {
        const { date } = req.query;
        const start = new Date(date);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const sales = await Sale.find({
            timestamp: { $gte: start, $lt: end }
        });

        let profit = 0;
        for (const sale of sales) {
            const batches = await Batch.find({ inventory: sale.inventory });
            const totalPurchasePrice = batches.reduce((acc, batch) => acc + (batch.quantity * batch.purchasePrice), 0);
            const totalQuantity = batches.reduce((acc, batch) => acc + batch.quantity, 0);
            const avgPurchasePrice = totalQuantity > 0 ? totalPurchasePrice / totalQuantity : 0;
            profit += sale.price - (avgPurchasePrice * sale.quantity);
        }

        res.status(200).json({ success: true, profit });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get remaining stock as of a specific date
exports.getStock = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = new Date(date);

        const batches = await Batch.find({ timestamp: { $lte: targetDate } });
        const sales = await Sale.find({ timestamp: { $lte: targetDate } });

        const inventoryStock = {};

        batches.forEach(batch => {
            if (!inventoryStock[batch.inventory]) {
                inventoryStock[batch.inventory] = 0;
            }
            inventoryStock[batch.inventory] += batch.quantity;
        });

        sales.forEach(sale => {
            if (inventoryStock[sale.inventory]) {
                inventoryStock[sale.inventory] -= sale.quantity;
            }
        });

        res.status(200).json({ success: true, stock: inventoryStock });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get top sellers within a date range
exports.getTopSellers = async (req, res) => {
    try {
        const { startDate, endDate, limit = 10 } = req.query;
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);

        const sales = await Sale.aggregate([
            { $match: { timestamp: { $gte: start, $lt: end } } },
            { $group: { _id: '$user', totalSales: { $sum: '$price' } } },
            { $sort: { totalSales: -1 } },
            { $limit: parseInt(limit, 10) }
        ]);

        res.status(200).json({ success: true, topSellers: sales });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get top buyers within a date range
exports.getTopBuyers = async (req, res) => {
    try {
        const { startDate, endDate, limit = 10 } = req.query;
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);

        const sales = await Sale.aggregate([
            { $match: { timestamp: { $gte: start, $lt: end } } },
            { $group: { _id: '$customer', totalPurchases: { $sum: '$price' } } },
            { $sort: { totalPurchases: -1 } },
            { $limit: parseInt(limit, 10) }
        ]);

        res.status(200).json({ success: true, topBuyers: sales });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};