const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profilePicture:String,
    verificationToken: String,
    verificationTokenExpires: Date,
    verified: {
        type: Boolean,
        default: false
    },
    firstname: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
              return /^[a-zA-Z]+$/.test(v);
            },
            message: props => `${props.value} is not a valid name!`
          },
    },
    surname: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
              return /^[a-zA-Z]+$/.test(v);
            },
            message: props => `${props.value} is not a valid name!`
          },
    },
    email: {
        type: String,
        required: true,
        unique: true  // This is to ensure that no two users can have the same email
    },
    password: {
        type: String,
        required: true,
        max: 255,
        min: 8
    },
    userBio: {
        type: String,
        required: false,
        default: "I am a new user"
    },
    
    posts: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    followers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    

});

const User = mongoose.model('User', userSchema);
module.exports = User;