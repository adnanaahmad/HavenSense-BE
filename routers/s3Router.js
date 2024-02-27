// Initialize express router
let router = require('express').Router();
// Import search controller
let s3Controller = require('../controllers/s3Controller');
// Import auth controller
let authController = require('../controllers/authController');
// s3 routes
router.get('/url', authController.protect, s3Controller.gets3Url);

// Export API routes
module.exports = router;