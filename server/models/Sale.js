const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inventoryItem: {
        type: Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    buyer: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    profit: {
        type: Number,
        required: true
    },
    batches: [{
        type: Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    }]
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
