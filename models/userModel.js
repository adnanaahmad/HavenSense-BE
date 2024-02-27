let mongoose = require('mongoose');
let validator = require('validator');
const bcrypt = require('bcrypt');

// Setup schema
let userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid email']
    },
    media: {
        type: String,
        default: ''
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: [true, 'Please provide your password']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // this function only runs on create and save
            validator: function(el) {
                return el === this.password;
            }
        }
    },
    accountStatus: {
        type: Boolean,
        default: false
    },
    block: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
    followers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        default: [],
    },
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        default: [],
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    portfolio: {
        type: String,
        default: ''
    },
    profession: {
        type: String,
        default: ''
    }
});

/**
 * this function only runs if password is modified
 */
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});
/**
 * we're gonna create something called an instance method. 
 * So an instance method is basically a method that is gonna
 * be available on all documents of a certain collection
 */
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

// Export user
module.exports = mongoose.model('User', userSchema);