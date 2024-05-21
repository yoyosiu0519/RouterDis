const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    locations: [
        {
            day: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
                required: true

            },
            description: {
                type: String

            },
            transport: {
                type: String
            },
            duration: {
                type: String
            },
        }

    ],
    points: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            star: {
                type: Number,
                required: true,
                min: 0, 
                max: 5 
            }
        }

    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }

        }
    ],
    saved: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }

    ],
    
    
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;