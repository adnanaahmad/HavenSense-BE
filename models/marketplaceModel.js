let mongoose = require('mongoose');

let marketplaceSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Product must belong to a user']
    },
    media: {
        type: String,
        required: [true, 'Product must have a media']
    },
    name: {
        type: String,
        required: [true, 'Product must have a name']
    },
    description: {
        type: String,
        required: [true, 'Product must have a description']
    },
    category: {
        type: String,
        enum: ['digital', 'service', 'product'],
        required: [true, 'Product must belong to a category']
    },
    price: {
        type: Number,
        required: [true, 'Product must have a price tag'],
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    removed: {
        type: Boolean,
        default: false
    }
});

// Export marketplace
module.exports = mongoose.model('Marketplace', marketplaceSchema);