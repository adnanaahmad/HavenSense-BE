// Initialize express router
let router = require('express').Router();
// Import payment controller
let paymentController = require('../controllers/paymentController');
// Import auth controller
let authController = require('../controllers/authController');

// Payment routes
router.get('/donation/:amount', authController.protect, paymentController.getCheckoutSessionForDonation);
router.get('/cart', authController.protect, paymentController.getCheckoutSessionForCart);

// Export API routes
module.exports = router;