// Initialize express router
let router = require('express').Router();
// Import search controller
let searchController = require('../controllers/searchController');
// Import auth controller
let authController = require('../controllers/authController');
// Search routes
router.get('/userAndPost/:query', authController.protect, searchController.getUserAndPost);

// Export API routes
module.exports = router;