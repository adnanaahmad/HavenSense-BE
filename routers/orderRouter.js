let router = require('express').Router();
// Import order controller
let orderController = require('../controllers/orderController');
// Import auth controller
let authController = require('../controllers/authController');

// order routes
router.get('/seller', authController.protect, orderController.getSellerOrder);
router.get('/buyer', authController.protect, orderController.getBuyerOrder);

// Export API routes
module.exports = router;