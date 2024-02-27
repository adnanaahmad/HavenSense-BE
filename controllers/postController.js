// Import post model
let Post = require('../models/postModel');
// Import catchAsync wrapper
const catchAsync = require('../utility/catchAsync');
// Import error class
const AppError = require('../utility/appError');

// Handle create Post
exports.createPost = catchAsync(async (req, res, next) => {
    const post = await Post.create({
        user: req.user.id,
        media: req.body.media,
        description: req.body.description,
    });
    res.status(201).json({
        status: 'success',
        data: {
            post
        }
    });
});
// Handle view Post
exports.getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findOne({_id: req.params.id, user: req.user.id});
    res.status(200).json({
        status: 'success',
        data: {
            post
        }
    });
});
// Handle view all Posts
exports.getAllPost = catchAsync(async (req, res, next) => {
    const posts = await Post.find({user: req.user.id}).populate('user comments.user reactions.user', 'id name email media').sort({dateCreated: -1});
    res.status(200).json({
        status: 'success',
        data: {
            posts
        }
    });
});
// Handle view all Posts by User Id
exports.getAllPostByUserId = catchAsync(async (req, res, next) => {
    const posts = await Post.find({user: req.params.id}).populate('user comments.user reactions.user', 'id name email media').sort({dateCreated: -1});
    res.status(200).json({
        status: 'success',
        data: {
            posts
        }
    });
});
// Handle update Post
exports.updatePost = catchAsync(async (req, res, next) => {
    const requestObj = {
        media: req.body.media,
        description: req.body.description
    }
    const post = await Post.findOneAndUpdate({_id: req.params.id, user: req.user.id}, requestObj, {
        new: true,
        runValidators: true
    }).populate('user comments.user reactions.user', 'id name email media');
    res.status(200).json({
        status: 'success',
        data: {
            post
        }
    });
});
// Handle delete Post
exports.deletePost = catchAsync(async (req, res, next) => {
    await Post.findOneAndDelete({_id: req.params.id, user: req.user.id});
    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Handle create Comment
exports.createComment = catchAsync(async (req, res, next) => {
    const comment = {
        user: req.user.id,
        comment: req.body.comment
    };
    const post = await Post.findByIdAndUpdate(req.params.id,
        { 
            '$push': { 
                'comments': comment 
            } 
        },
        {
            new: true
        }
    ).populate('user comments.user reactions.user', 'id name email media');

    res.status(201).json({
        status: 'success',
        data: {
            post
        }
    });
});

// Handle Add Reaction
exports.addReaction = catchAsync(async (req, res, next) => {
    const reaction = {
        user: req.user.id,
        reaction: req.body.reaction
    };
    // find if user's reaction exists in post
    let post = await Post.findOne(
        {'_id' : req.params.id, 'reactions.user': req.user.id}
    )
    // if no reaction exists push it else replace it
    if (!post) {
        post = await Post.findByIdAndUpdate(req.params.id,
            { 
                '$push': {
                    'reactions': reaction 
                } 
            },
            {
                new: true
            }
        ).populate('user comments.user reactions.user', 'id name email media');
    } else {
        post = await Post.findOneAndUpdate(
            {
                '_id' : req.params.id, 
                'reactions.user': req.user.id
            },
            { 
                '$set': {
                    'reactions.$.reaction': req.body.reaction 
                } 
            },
            {
                new: true
            }
        ).populate('user comments.user reactions.user', 'id name email media');
    }

    res.status(201).json({
        status: 'success',
        data: {
            post
        }
    });
});

// Handle Delete Reaction
exports.deleteReaction = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id,
        { '$pull': { 'reactions': {'user' : req.user.id} } },
        {
            new: true
        }
    ).populate('user comments.user reactions.user', 'id name email media');
    res.status(201).json({
        status: 'success',
        data: {
            post
        }
    });
});

// Handle view News Feed
exports.getNewsFeed = catchAsync(async (req, res, next) => {
    // get all posts by user and user's following
    const post = await Post.find({
        user: { $in: [req.user.id, ...req.user.following] }
    })
    .populate('user comments.user reactions.user', 'id name email media')
    .sort({dateCreated: -1});

    res.status(200).json({
        status: 'success',
        data: {
            post
        }
    });
});