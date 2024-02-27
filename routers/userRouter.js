// Initialize express router
let router = require('express').Router();
// Import user controller
let userController = require('../controllers/userController');
// Import auth controller
let authController = require('../controllers/authController');
// User routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/verifyAccount', authController.protect, authController.verifyAccount);

router.delete('/followers/:id', authController.protect, userController.removeFollowers);
router.route('/following/:id')
    .patch(authController.protect, userController.addFollowing)
    .delete(authController.protect, userController.removeFollowing);

router.get('/all', authController.protect, authController.isAdmin, userController.getAllUsers);
router.patch('/block/:id', authController.protect, authController.isAdmin, userController.blockUser);
router.patch('/unblock/:id', authController.protect, authController.isAdmin, userController.unBlockUser);

router.route('/')
    .get(authController.protect, userController.getUser)
    .patch(authController.protect, userController.updateUser);
router.route('/:id')
    .get(authController.protect, userController.getUserById)
    .delete(authController.protect, userController.deleteUser);
// Export API routes
module.exports = router;