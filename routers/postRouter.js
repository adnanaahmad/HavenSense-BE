// Initialize express router
let router = require('express').Router();
// Import post controller
let postController = require('../controllers/postController');
// Import auth controller
let authController = require('../controllers/authController');

// Post routes
router.get('/newsFeed', authController.protect, postController.getNewsFeed);
router.get('/userFeed/:id', authController.protect, postController.getAllPostByUserId);
router.post('/comments/:id', authController.protect, postController.createComment);
router.route('/reactions/:id')
    .post(authController.protect, postController.addReaction)
    .delete(authController.protect, postController.deleteReaction);

router.route('/')
    .get(authController.protect, postController.getAllPost)
    .post(authController.protect, postController.createPost);
router.route('/:id')
    .get(authController.protect, postController.getPost)
    .patch(authController.protect, postController.updatePost)
    .put(authController.protect, postController.updatePost)
    .delete(authController.protect, postController.deletePost);
// Export API routes
module.exports = router;