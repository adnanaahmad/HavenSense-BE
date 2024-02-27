let mongoose = require('mongoose');

// Setup schema
let cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Product must belong to a user']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marketplace',
        required: [true, 'Product must exist']
    },
    quantity: {
        type: Number,
        default: 1,
        required: [true, 'Product must have a quantity'],
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// Export cart
module.exports = mongoose.model('Cart', cartSchema);