const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    inventoryItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Batch', batchSchema);