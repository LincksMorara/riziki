const Inventory = require('../models/Inventory');
const Batch = require('../models/Batch');
const Sale = require('../models/Sale');

// Add Inventory item
exports.addInventory = async (req, res) => {
    const { name, category, quantity, pricePerKg } = req.body;
    
    try {
        const newInventory = new Inventory({
            name,
            category,
            quantity,
            pricePerKg
        });

        const savedInventory = await newInventory.save();
        res.status(201).json({ success: true, data: savedInventory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Add a new batch to an inventory item
exports.addBatch = async (req, res) => {
    const { inventoryName, quantity, supplier, pricePerKg, purchaseDate } = req.body;

    try {
        const inventory = await Inventory.findOne({name: inventoryName});
        if (!inventory) {
            return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }

        // Extract the inventory ID from the found inventory object
        const inventoryId = inventory._id;

        const newBatch = new Batch({
            inventory: inventoryId, // Use the extracted inventory ID here
            quantity,
            supplier,
            pricePerKg,
            purchaseDate
        });

        const savedBatch = await newBatch.save();
        inventory.batches.push(savedBatch._id);
        await inventory.save();

        res.status(201).json({ success: true, data: savedBatch });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get inventory details
exports.getInventoryDetails = async (req, res) => {
    try {
        const inventory = await Inventory.findOne({ name: req.params.name }).populate('batches');
        if (!inventory) {
            return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }

        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update inventory item
exports.updateInventory = async (req, res) => {
    const {name} = req.params;// Get the name from request parameters
    const updates = req.body;

    try {
        //first find the inventory item by name to get the id
        const inventoryItem = await Inventory.findOne({name: name});
        if (!inventoryItem) {
            return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }
        //use the found ID to update the inventory item
        const updatedInventory = await Inventory.findByIdAndUpdate(inventoryItem._id, updates, { new: true });
        if (!updatedInventory) {
            return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }

        res.status(200).json({ success: true, data: updatedInventory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete inventory item by name
exports.deleteInventory = async (req, res) => {
    const { name } = req.params;

    try {
        // First, find the inventory item by name to get its ID
        const inventoryItem = await Inventory.findOne({ name: name });
        if (!inventoryItem) {
            return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }

        // Use the found ID to delete the inventory item
        const deletedInventory = await Inventory.findByIdAndDelete(inventoryItem._id);
        if (!deletedInventory) {
            // This condition might actually never be true because findByIdAndDelete will return the document, if found, before it's deleted.
            return res.status(404).json({ success: false, error: 'Failed to delete inventory item' });
        }

        res.status(200).json({ success: true, data: deletedInventory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all inventory items
exports.getAllInventory = async (req, res) => {
    try {
        const inventoryItems = await Inventory.find().populate('batches');
        res.status(200).json({ success: true, data: inventoryItems });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Record a sale
exports.recordSale = async (req, res) => {
    const { userId, inventoryId, quantity, sellingPrice, buyer, saleDate } = req.body;

    try {
        const inventory = await Inventory.findById(inventoryId).populate('batches');
        if (!inventory) {
            return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }

        // Find the oldest batch that has enough quantity
        let batchToUse = null;
        for (const batch of inventory.batches) {
            if (batch.quantity >= quantity) {
                batchToUse = batch;
                break;
            }
        }

        if (!batchToUse) {
            return res.status(400).json({ success: false, error: 'Insufficient stock' });
        }

        // Calculate profit using batch pricePerKg
        const profit = quantity * (sellingPrice - batchToUse.pricePerKg);

        // Update batch quantity
        batchToUse.quantity -= quantity;
        await batchToUse.save();

        // Create new sale record
        const newSale = new Sale({
            user: userId,
            inventory: inventoryId,
            buyer,
            quantity,
            price: sellingPrice,
            date: saleDate,
            profit // Store profit in the sale record
        });

        const savedSale = await newSale.save();

        res.status(201).json({ success: true, data: savedSale });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all sales
exports.getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find().populate('user inventory');
        res.status(200).json({ success: true, data: sales });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get sales for a specific date range
exports.getSalesByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const sales = await Sale.find({
            saleDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).populate('user inventory');
        
        res.status(200).json({ success: true, data: sales });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get top buyers within a date range
exports.getTopBuyers = async (req, res) => {
    const { startDate, endDate, limit } = req.query;

    try {
        const buyers = await Sale.aggregate([
            { $match: { saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
            { $group: { _id: "$buyer", totalAmount: { $sum: "$sellingPrice" } } },
            { $sort: { totalAmount: -1 } },
            { $limit: parseInt(limit, 10) }
        ]);

        res.status(200).json({ success: true, data: buyers });
    } catch (error) {
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
