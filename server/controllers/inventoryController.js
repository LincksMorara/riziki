const Inventory = require('../models/Inventory');
const Batch = require('../models/Batch');
const Sale = require('../models/Sale');

// Controller function to add an inventory item with its initial batch or just a batch if the inventory item already exists
exports.addInventoryWithBatch = async (req, res) => {
    const { name, category, batchQuantity, supplier, batchPricePerKg, purchaseDate, unitSize } = req.body;

    try {
        let inventory = await Inventory.findOne({ name, category });

        if (!inventory) {
            inventory = new Inventory({
                name,
                category,
                quantity: batchQuantity,
                unitSize // Ensure unitSize is included here only when creating a new inventory item
            });

            inventory = await inventory.save();
        } else {
            // Update the quantity of the existing inventory item
            inventory.quantity += batchQuantity;
            await inventory.save();
        }

        const newBatch = new Batch({
            inventoryItem: inventory._id,
            quantity: batchQuantity,
            supplier,
            pricePerKg: batchPricePerKg,
            date: purchaseDate
        });

        const savedBatch = await newBatch.save();

        res.status(201).json({ success: true, data: { inventory, batch: savedBatch } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



// Get Inventory Details
exports.getInventoryDetails = async (req, res) => {
    try {
        // Fetch all inventory items from the database
        const inventoryItems = await Inventory.find({}, 'name category quantity');

        // Respond with the inventory items
        res.status(200).json({ success: true, data: inventoryItems });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get Batch Details of a Specific Inventory Item
exports.getBatchDetails = async (req, res) => {
    const { name, category } = req.body;

    try {
        // Find the inventory item by name and category
        const inventory = await Inventory.findOne({ name, category });

        // If the inventory item does not exist, respond with an error
        if (!inventory) {
            return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }

        // Find all batches associated with the inventory item
        const batches = await Batch.find({ inventoryItem: inventory._id });

        // Respond with the batch details
        res.status(200).json({ success: true, data: batches });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete items from a batch of an inventory item
exports.deleteItemsFromBatch = async (req, res) => {
    const { name, category, batchId, quantityToDelete } = req.body;

    try {
        // Find the inventory item by name and category
        const inventory = await Inventory.findOne({ name, category });

        if (!inventory) {
            return res.status(404).json({ success: false, error: 'Inventory item not found' });
        }

        // Retrieve batches associated with the inventory item
        const batches = await Batch.find({ inventoryItem: inventory._id }).sort({ date: 1 });

        if (!batches || batches.length === 0) {
            return res.status(404).json({ success: false, error: 'No batches found for the inventory item' });
        }

        // Delete items from batches starting from the oldest
        let itemsToDelete = quantityToDelete;
        let batchIndex = 0;

        while (itemsToDelete > 0 && batchIndex < batches.length) {
            const batch = batches[batchIndex];
            const itemsInBatch = batch.quantity;

            if (itemsInBatch >= itemsToDelete) {
                // If the batch has enough items to delete, update it and stop
                batch.quantity -= itemsToDelete;
                itemsToDelete = 0; // All items deleted
            } else {
                // If the batch doesn't have enough items, delete all from this batch and move to the next
                itemsToDelete -= itemsInBatch;
                batch.quantity = 0;
            }

            await batch.save();
            batchIndex++;
        }

        // Remove empty batches if any (batches with quantity === 0)
        await Batch.deleteMany({ quantity: 0 });

        // Update the inventory item quantity after deletion
        const remainingQuantity = batches.reduce((total, batch) => total + batch.quantity, 0);
        inventory.quantity = remainingQuantity;
        await inventory.save();

        // Respond with the updated inventory item and remaining batches
        res.status(200).json({ success: true, data: { inventory, batches } });
    } catch (error) {
        // Handle any errors that occur during the process
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
