// Import user model
let User = require('../models/userModel');
// Import post model
let Post = require('../models/postModel');
// Import catchAsync wrapper
const catchAsync = require('../utility/catchAsync');
// Import AppError class
const AppError = require('../utility/appError');


// Handle view Users And Posts
exports.getUserAndPost = catchAsync(async (req, res, next) => {
    let regexQuery = new RegExp(req.params.query,'ig');
    const posts = await Post.find({description: regexQuery}).populate('user comments.user reactions.user', 'id name email media');
    const users = await User.find({name: regexQuery}).select('id name email').lean();
    res.status(200).json({
        status: 'success',
        data: {
            users,
            posts
        }
    });
});