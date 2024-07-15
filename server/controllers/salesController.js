const Inventory = require('../models/Inventory');
const Batch = require('../models/Batch');
const Sale = require('../models/Sale');
const User = require('../models/User');

// Define a function to cleanup batches with quantity zero
const cleanupBatches = async (inventoryItemId) => {
    try {
        // Find all batches for the given inventory item
        const batches = await Batch.find({ inventoryItem: inventoryItemId });

        // Iterate through batches
        for (let batch of batches) {
            if (batch.quantity === 0) {
                // If batch quantity is zero, delete it from the database
                await Batch.findByIdAndDelete(batch._id);
                console.log(`Deleted batch ${batch._id} because quantity was zero.`);
            }
        }
    } catch (error) {
        console.error(`Error cleaning up batches: ${error.message}`);
    }
};


//Record a sale
exports.recordSale = async (req, res) => {
    const { username, name, category, quantity, sellingPrice, buyer, saleDate } = req.body;

    try {
        // Find the user by username to get the user's _id
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Find the inventory item by name and category
        const inventory = await Inventory.findOne({ name, category });
        if (!inventory) {
            return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }

        // Find all batches associated with the inventory item, sorted by date (oldest first)
        let batches = await Batch.find({ inventoryItem: inventory._id }).sort({ date: 1 });

        // Ensure there are batches available
        if (!batches || batches.length === 0) {
            return res.status(400).json({ success: false, error: 'No batches found for the inventory item' });
        }

        // Initialize variables to track quantity sold, total profit, and batches used
        let quantitySold = 0;
        let totalProfit = 0;
        const batchesUsed = [];

        // Iterate through batches to find a batch with non-zero quantity
        let i = 0;
        while (i < batches.length && quantitySold < quantity) {
            const batch = batches[i];

            // Check if batch quantity is non-zero and available for sale
            if (batch.quantity > 0) {
                // Determine how much can be sold from this batch
                const remainingQuantity = quantity - quantitySold;

                if (batch.quantity >= remainingQuantity) {
                    // Deduct remaining needed quantity from current batch
                    batch.quantity -= remainingQuantity;
                    quantitySold += remainingQuantity;

                    // Calculate profit for the current batch
                    const profit = remainingQuantity * (sellingPrice - batch.pricePerKg * inventory.unitSize);
                    totalProfit += profit;

                    // Add current batch to batchesUsed array
                    batchesUsed.push(batch._id);

                    // Save updated batch
                    await batch.save();

                    // Exit loop as sale is completed
                    break;
                } else {
                    // Deduct entire batch quantity from remaining needed
                    quantitySold += batch.quantity;

                    // Calculate profit for the current batch
                    const profit = batch.quantity * (sellingPrice - batch.pricePerKg * inventory.unitSize);
                    totalProfit += profit;

                    // Add current batch to batchesUsed array
                    batchesUsed.push(batch._id);

                    // Set current batch quantity to zero (fully sold)
                    batch.quantity = 0;

                    // Save updated batch
                    await batch.save();
                }
            }

            // Move to the next batch
            i++;
        }

        // Handle case where requested quantity exceeds available stock
        if (quantitySold < quantity) {
            return res.status(400).json({ success: false, error: 'Insufficient stock' });
        }

        // Deduct sold quantity from inventory
        inventory.quantity -= quantitySold;

        // Save updated inventory
        await inventory.save();

        // Create a new sale record
        const newSale = new Sale({
            user: user._id,
            inventoryItem: inventory._id,
            buyer,
            quantity,
            price: sellingPrice,
            date: saleDate,
            profit: totalProfit,
            batches: batchesUsed
        });

        const savedSale = await newSale.save();

        // Call batch cleanup function asynchronously after sale is recorded
        cleanupBatches(inventory._id);

        // Respond with the saved sale record
        res.status(201).json({ success: true, data: savedSale });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Get sales for a specific date range
exports.getSalesByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;

    // Validate startDate and endDate
    if (!startDate || !endDate || isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
        return res.status(400).json({ success: false, error: "Invalid startDate or endDate" });
    }

    try {
        const sales = await Sale.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        })
        .populate('user') // Populating the user
        .populate('inventoryItem') // Corrected path
        .populate('batches'); // Populating batches if needed
        
        res.status(200).json({ success: true, sales });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getProfit = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const sales = await Sale.find({
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });

        const totalProfit = sales.reduce((acc, sale) => acc + sale.profit, 0);

        res.status(200).json({ success: true, totalProfit });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get top buyers within a date range
exports.getTopBuyers = async (req, res) => {
    const { startDate, endDate, limit } = req.query;

    try {
        const buyers = await Sale.aggregate([
            // Match sales within the provided date range
            { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
            // Group sales by buyer, summing up the total price for each buyer
            { $group: { _id: "$buyer", totalAmount: { $sum: "$price" } } },
            // Sort the results by totalAmount in descending order to get top buyers
            { $sort: { totalAmount: -1 } },
            // Limit the number of results to the provided limit
            { $limit: parseInt(limit, 10) }
        ]);

        // Send a successful response with the aggregated data
        res.status(200).json({ success: true, data: buyers });
    } catch (error) {
        // Handle any errors during the aggregation process
        res.status(500).json({ success: false, error: error.message });
    }
};


// Get top sellers within a date range
exports.getTopSellers = async (req, res) => {
    const { startDate, endDate, limit } = req.query;

    try {
        const sellers = await Sale.aggregate([
            { $match: { saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
            { $group: { _id: "$user", totalAmount: { $sum: "$sellingPrice" } } },
            { $sort: { totalAmount: -1 } },
            { $limit: parseInt(limit, 10) }
        ]);

        res.status(200).json({ success: true, data: sellers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
