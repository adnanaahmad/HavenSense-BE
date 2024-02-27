let mongoose = require('mongoose');
let AppError = require('../utility/appError');

// Setup schema
let commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Comment must belong to a user'],
    },
    comment: {
        type: String,
        required: [true, 'User must enter a comment']
    }
});

let reactionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Reaction must belong to a user'],
    },
    reaction: {
        type: String,
        enum: ['like', 'love', 'collab'],
        required: [true, 'User must react to a post']
    }
});

let postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Post must belong to a user'],
    },
    media: {
        type: String,
    },
    description: {
        type: String,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: [commentSchema]
    },
    reactions: {
        type: [reactionSchema]
    }
});

// pre save hook 
postSchema.pre('save', function(next) {
    if(!this.media && !this.description) next(new AppError('No media or description found', 400));
    next();
});

// pre update hook
postSchema.pre('findOneAndUpdate', function(next) {
    if ('media' in this._update && 'description' in this._update) if(!this._update.media && !this._update.description) next(new AppError('No media or description found', 400));
    next();
});

// Export post
module.exports = mongoose.model('Post', postSchema);