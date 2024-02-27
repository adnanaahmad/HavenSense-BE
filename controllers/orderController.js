// Import order model
let Order = require('../models/orderModel');
// Import catchAsync wrapper
const catchAsync = require('../utility/catchAsync');

// Handle view orders by seller
exports.getSellerOrder = catchAsync(async (req, res, next) => {
    const order = await Order.find({seller: req.user.id}).populate('buyer', 'id name email media').populate('product').sort({dateCreated: -1});
    res.status(200).json({
        status: 'success',
        data: {
            order
        }
    });
});

// Handle view orders by buyer
exports.getBuyerOrder = catchAsync(async (req, res, next) => {
    const order = await Order.find({buyer: req.user.id}).populate('seller', 'id name email media').populate('product').sort({dateCreated: -1});
    res.status(200).json({
        status: 'success',
        data: {
            order
        }
    });
});