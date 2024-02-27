let router = require('express').Router();
// Import post controller
let cartController = require('../controllers/cartController');
// Import auth controller
let authController = require('../controllers/authController');

// Cart routes

router.route('/')
    .get(authController.protect, cartController.getCart)
    .delete(authController.protect, cartController.emptyCart);

router.route('/:id/:remove?')
    .post(authController.protect, cartController.addToCart)
    .delete(authController.protect, cartController.removeFromCart);
// Export API routes
module.exports = router;