// Import cart model
let Cart = require('../models/cartModel');
// Import catchAsync wrapper
const catchAsync = require('../utility/catchAsync');

// Handle view cart
exports.getCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.find({user: req.user.id}).populate('user', 'id name email media').populate('product').sort({dateCreated: -1});
    res.status(200).json({
        status: 'success',
        data: {
            cart
        }
    });
});

// Handle add product to cart
exports.addToCart = catchAsync(async (req, res, next) => {

    // check if product exists in cart
    let product = await Cart.findOne({product : req.params.id, user: req.user.id});
    // create a new one if it doesn't exist else add 1 to the quantity
    if (product) {
        product = await Cart.findOneAndUpdate({product: req.params.id, user: req.user.id}, { $inc: {'quantity': 1 } }, { new: true });
    } else {

        product = await Cart.create({
            user: req.user.id,
            product: req.params.id
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});

// Handle removal of product from cart
exports.removeFromCart = catchAsync(async (req, res, next) => {

    if (req.params.remove) {
        await Cart.findOneAndDelete({product: req.params.id, user: req.user.id});
    } else {
        // check if product quantity is atleast 1, deduct quantity by 1 else remove the whole product

        let product = await Cart.findOne({product : req.params.id, user: req.user.id});

        if (product.quantity > 1){
            await Cart.findOneAndUpdate({product: req.params.id, user: req.user.id}, { $inc: {'quantity': -1 } }, { new: true });

        } else {
            await Cart.findOneAndDelete({product: req.params.id, user: req.user.id});
        }
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Handle empty cart
exports.emptyCart = catchAsync(async (req, res, next) => {
    await Cart.deleteMany({user: req.user.id});
    res.status(204).json({
        status: 'success',
        data: null
    });
});