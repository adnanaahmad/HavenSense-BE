// Initialize express router
let router = require('express').Router();
// Import marketplace controller
let marketplaceController = require('../controllers/marketplaceController');
// Import auth controller
let authController = require('../controllers/authController');

// Marketplace routes
router.get('/user', authController.protect, marketplaceController.getMarketplaceByUser);
router.get('/user/:id', authController.protect, marketplaceController.getMarketplaceByUserId);

router.route('/')
    .get(authController.protect, marketplaceController.getMarketplace)
    .post(authController.protect, marketplaceController.createProduct);
router.route('/:id')
    .get(authController.protect, marketplaceController.getProduct)
    .patch(authController.protect, marketplaceController.updateProduct)
    .delete(authController.protect, marketplaceController.deleteProduct);
// Export API routes
module.exports = router;