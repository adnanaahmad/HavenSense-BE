// Initialize express router
const express = require('express');
let router = express.Router();
// Import payment controller
let paymentController = require('../controllers/paymentController');

// Payment routes
router.post('/', paymentController.listenForCheckout);

// Export API routes
module.exports = router;