let mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a buyer']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a seller']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marketplace',
        required: [true, 'Product must exist']
    },
    price: {
        type: Number,
        required: [true, 'Product must have a price tag'],
    },
    quantity: {
        type: Number,
        required: [true, 'Product must have a quantity'],
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
});

// Export order
module.exports = mongoose.model('Order', orderSchema);