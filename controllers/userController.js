// Import user model
let User = require('../models/userModel');
// Import catchAsync wrapper
const catchAsync = require('../utility/catchAsync');
// Import AppError class
const AppError = require('../utility/appError');

// Handle create user
exports.createUser = function (req, res) {
    res.send('createUser api is working');
};
// Handle view all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({_id: { $ne: req.user.id }}).select('-password -confirmPassword');
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});
// Handle view user
exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('-password -confirmPassword').populate('following followers', 'id name email media');
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
// Handle view user by id
exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password -confirmPassword').populate('following followers', 'id name email media');
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
// Handle view all users
exports.getAllUser = function (req, res) {
    res.send('getAllUser api is working');
};
// Handle update user
exports.updateUser = catchAsync(async (req, res, next) => {
    const requestObj = {
        name: req.body.name,
        media: req.body.media,
        bio: req.body.bio,
        location: req.body.location,
        portfolio: req.body.portfolio,
        profession: req.body.profession
    }
    const user = await User.findByIdAndUpdate(req.user.id, requestObj, {
        new: true,
        runValidators: true
    }).select('-password -confirmPassword').populate('following followers', 'id name email media');
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
// Handle delete user
exports.deleteUser = function (req, res) {
    res.send('deleteUser api is working');
};

// Handle delete follower
exports.removeFollowers = catchAsync(async (req, res, next) => {
    // update user's followers list
    const user = await User.findByIdAndUpdate(req.user.id,
        { '$pull': { 'followers': req.params.id } }, {new : true}
    ).select('-password -confirmPassword').populate('following followers', 'id name email media');
    // update friend's following list
    const friend = await User.findByIdAndUpdate(req.params.id,
        { '$pull': { 'following': req.user.id } }, {new : true}
    ).select('-password -confirmPassword').populate('following followers', 'id name email media');
    res.status(200).json({
        status: 'success',
        data: {
            user,
            friend
        }
    });
});

// Handle add following
exports.addFollowing = catchAsync(async (req, res, next) => {
    const userExists = await User.findOne(
        {'_id': req.user.id, following: req.params.id}
    );
    if (userExists) return next(new AppError('User already exists in friends list', 400));
    // update user's following list
    const user = await User.findByIdAndUpdate(req.user.id,
        { '$push': { 'following':  req.params.id } }, {new : true}
    ).select('-password -confirmPassword').populate('following followers', 'id name email media');
    // update friend's followers list
    const friend = await User.findByIdAndUpdate(req.params.id,
        { '$push': { 'followers': req.user.id } }, {new : true}
    ).select('-password -confirmPassword').populate('following followers', 'id name email media');
    res.status(200).json({
        status: 'success',
        data: {
            user,
            friend
        }
    });
});

// Handle delete following
exports.removeFollowing = catchAsync(async (req, res, next) => {
    // update user's following list
    const user = await User.findByIdAndUpdate(req.user.id,
        { '$pull': { 'following': req.params.id } }, {new : true}
    ).select('-password -confirmPassword').populate('following followers', 'id name email media');
    // update friend's followers list
    const friend = await User.findByIdAndUpdate(req.params.id,
        { '$pull': { 'followers': req.user.id } }, {new : true}
    ).select('-password -confirmPassword').populate('following followers', 'id name email media');
    res.status(200).json({
        status: 'success',
        data: {
            user,
            friend
        }
    });
});

// Handle block user
exports.blockUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, {block: true}, {
        new: true,
        runValidators: true
    }).select('-password -confirmPassword');
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

// Handle un block user
exports.unBlockUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, {block: false}, {
        new: true,
        runValidators: true
    }).select('-password -confirmPassword');
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});