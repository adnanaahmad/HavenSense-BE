// Import markeplace model
let Marketplace = require('../models/marketplaceModel');
// Import catchAsync wrapper
const catchAsync = require('../utility/catchAsync');

// Handle create Product
exports.createProduct = catchAsync(async (req, res, next) => {
    const product = await Marketplace.create({
        user: req.user.id,
        media: req.body.media,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price
    });
    res.status(201).json({
        status: 'success',
        data: {
            product
        }
    });
});
// Handle view Product
exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Marketplace.findOne({_id: req.params.id}).populate('user', 'id name email media');
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});
// Handle view marketplace
exports.getMarketplace = catchAsync(async (req, res, next) => {
    const marketplace = await Marketplace.find().populate('user', 'id name email media').sort({dateCreated: -1});
    res.status(200).json({
        status: 'success',
        data: {
            marketplace
        }
    });
});

// Handle view marketplace by user
exports.getMarketplaceByUser = catchAsync(async (req, res, next) => {
    const marketplace = await Marketplace.find({user: req.user.id}).populate('user', 'id name email media').sort({dateCreated: -1});
    res.status(200).json({
        status: 'success',
        data: {
            marketplace
        }
    });
});

// Handle view marketplace by user Id
exports.getMarketplaceByUserId = catchAsync(async (req, res, next) => {
    const marketplace = await Marketplace.find({user: req.params.id}).populate('user', 'id name email media').sort({dateCreated: -1});
    res.status(200).json({
        status: 'success',
        data: {
            marketplace
        }
    });
});

// Handle update Product
exports.updateProduct = catchAsync(async (req, res, next) => {
    const requestObj = {
        media: req.body.media,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price
    }
    const product = await Marketplace.findOneAndUpdate({_id: req.params.id, user: req.user.id}, requestObj, {
        new: true,
        runValidators: true
    }).populate('user', 'id name email media');
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});
// Handle delete Product
exports.deleteProduct = catchAsync(async (req, res, next) => {
    let product = await Marketplace.findOneAndUpdate({_id: req.params.id, user: req.user.id}, {removed: true},{
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});
