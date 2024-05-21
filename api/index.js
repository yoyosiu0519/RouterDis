require('dotenv').config(); // Import dotenv
const express = require('express'); // Import express
const bodyParser = require('body-parser'); // Import body-parser
const mongoose = require('mongoose'); // Import mongoose
const crypto = require('crypto'); // Import crypto
const bcrypt = require('bcrypt'); // Import bcrypt
const nodemailer = require('nodemailer'); // Import nodemailer
const cors = require('cors'); // Import cors
const app = express(); // Create app
const port = 3000;
const saltRounds = 10;

app.use(cors()); // Use cors
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, //Parse MongoDB connection strings 
    useUnifiedTopology: true, 
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error: Unable to connect to MongoDB ", err);
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

const User = require('./models/user'); // Import user model
const Post = require('./models/post'); // Import post model

//Endpoints for user resgisteration

app.post("/register", async (req, res) => {
    try {
        const { firstname, surname, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

        //Check if email is already in use
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ message: "Email already in use" });
        }
        //Create a new user
        const newUser = new User({
            firstname,
            surname,
            email,
            password: hashedPassword
        });

        //Generate the verification token & set the expiration time
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");
        newUser.verificationTokenExpires = Date.now() + 1200000; // 20 minutes

        await newUser.save();

        //Send the verification email
        sendVerificationEmail(newUser.email, newUser.verificationToken);
        res.status(202).json({
            message: "User registered successfully, please check your email for the verification link to activate your account"

        });

    } catch (error) {
        console.log("Unable to register user", error);
        res.status(400).json({
            message: "Unable to register user"
        });
    }
});

// Verification email
const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "yoyosiu0519@gmail.com",
            pass: "iaec emfe twvk rnwx"
        }
    });

    //Email message
    const mailOptions = {
        from: "router@gmail.com",
        to: email,
        subject: "Router Account Verification",
        text: `Click on the link to verify your account: http://localhost:3000/verify/${verificationToken}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent");
    } catch (error) {
        console.log("Unable to send verification email", error);
    }
};

//Endpoint to verify email
app.get('/verify/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ message: "Invalid token" })
        }
        if (Date.now() > user.verificationTokenExpires) {
            await User.deleteOne({ _id: user._id });
            return res.status(400).json({ message: "Token expired, please register again" });
        }
        
        user.verified = true; //mark the user as verified
        user.verificationToken = undefined; //remove the verification token
        user.verificationTokenExpires = undefined; //remove the verification token expiration time
        await user.save();
        res.status(200).json({ message: "Email has been verified successfully" })
    } catch (error) {
        res.status(500).json({ message: "Unable to verify email" })
    }
})

//Token
const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey;
}
const secretKey = generateSecretKey();

//Endpoint for login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });//Check if user exists already
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (!user.verified) {
            return res.status(401).json({ message: 'User not verified' });
        }
        // Compare the entered password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).end();
        }
        const token = jwt.sign({ userID: user._id }, secretKey)
        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.log("Unable to login", error);
        res.status(500).json({
            message: "Unable to login"
        });
    }
})


//Endpoint to get all users
app.get("/user/:userID", async (req, res) => {
    try {
        User.find({}).then((users) => {
            res.status(200).json({ users });
        }).catch((error) => {
            console.log("Unable to get all users", error);
            res.status(500).json({ message: "Unable to get users" });
        })
    } catch (error) {
        res.status(500).json({
            message: "Unable to get users"
        });
    }
});

//Endpoint to update user profile
app.put("/user/:userID", async (req, res) => {
    try {
      const { userID } = req.params;
      const { firstname, surname, email, userBio } = req.body;
      const user = await User.findById(userID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (firstname) {
        user.firstname = firstname;
      }
  
      if (surname) {
        user.surname = surname;
      }
  
      if (email) {
        const emailExists = await User.findOne({ email });
  
        if (emailExists && emailExists._id.toString() !== userID) {
          return res.status(409).json({ message: "Email already in use" });
        }
  
        user.email = email;
      }

      if (userBio) {
        user.userBio = userBio;
      }
  
      await user.save();
  
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ message: "An error occurred while updating the user" });
    }
  });

//Endpoint to update user password
app.put("/user/:userID/password", async (req, res) => {
    try {
        const { userID } = req.params;
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Old password does not match" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        res.status(500).json({ message: "An error occurred while updating the password" });
    }
});

//endpoint to follow a user
app.post("/follow", async (req, res) => {
    const { loggedInUserID, followUserID } = req.body;
    try {
        await User.findByIdAndUpdate(followUserID, {
            $push: { followers: loggedInUserID }
        })
        res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Unable to follow user"
        });
    }
}
);

//endpoint for user's following
app.get("/users/:userID/following", async (req, res) => {
    const userID = req.params.userID;
    try {
        const followingUsers = await User.find({ followers: userID });
        res.status(200).json({ following: followingUsers });
    } catch (error) {
        res.status(500).json({
            message: "Unable to get following users"
        });
    }
});

// Endpoint to get all followers of a user
app.get("/users/:userID/followers", async (req, res) => {
    const userID = req.params.userID;
    try {
        const user = await User.findById(userID).populate('followers');
        res.status(200).json({ followers: user.followers });
    } catch (error) {
        res.status(500).json({
            message: "Unable to get followers"
        });
    }
});

// Endpoint to unfollow a user
app.post("/users/unfollow", async (req, res) => {
    const { loggedInUserID, unfollowUserID } = req.body;
    try {
        await User.findByIdAndUpdate(unfollowUserID, {
            $pull: { followers: loggedInUserID }
        })
        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Unable to unfollow user"
        });
    }
}
);

// Endpoint to create a new post
app.post("/newPost", async (req, res) => {
    const { destination, locations, userID } = req.body;
    try {
        const newPost = new Post({
            destination,
            locations,
            user: userID
        });
        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.log("Error creating post:", error); 
        res.status(500).json({
            message: "Unable to create post"
        });
    }
});

// Endpoint to get all posts
app.get("/posts", async (req, res) => {
    try {

        const posts = await Post.find()
        .populate('user', 'firstname surname')
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res
            .status(500)
            .json({ message: "An error occurred while getting the posts" });
    }
});

// Endpoint to get all posts uploaded by current logged in user
app.get("/posts/:userID", async (req, res) => {
    try {
        const { userID } = req.params;

        const posts = await Post.find({ user: userID })
            .populate('user', 'firstname surname')
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res
            .status(500)
            .json({ message: "An error occurred while getting the posts" });
    }
});
// Endpoint to save a post for logged in user

app.put("/posts/:postID/:userID/save", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user.toString() === req.params.userID) {
            return res.status(403).json({ message: "You cannot save your own post" });
        }
        const index = post.saved ? post.saved.findIndex(user => user.user.toString() === req.params.userID) : -1;
        if (index === -1) {
            // The post is not saved yet, save it
            post.saved.push({ user: req.params.userID });
        } else {
            // The post is already saved, unsave it
            post.saved.splice(index, 1);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('error:', error); // Log the error
        res.status(500).json({ message: "An error occurred while saving the post" });
    }
});

// Endpoint to get all saved posts for the current user

app.get("/users/:userID/savedPosts", async (req, res) => {
    try {
        const userID = req.params.userID;
        const posts = await Post.find({ "saved.user": userID });

        res.status(200).json({ savedPosts: posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to get saved posts"
        });
    }
});

// Endpoint for current logged in user profile

app.get("/profile/:userID", async (req, res) => {
    try {
        const userID = req.params.userID;
        const user = await User.findById(userID);

        if (!user) {
            console.log(`User with ID ${userID} not found`);
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.log(`Error while getting the profile: ${error}`);
        res.status(500).json({ message: "Error while getting the profile" });
    }
});

// Endpoint to delete a post

app.delete("/posts/:postID/:userID/delete", async (req, res) => {
    try {
      const { postID, userID } = req.params;
      const post = await Post.findOne({ _id: postID });
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      if (post.user.toString() !== userID) {
        return res.status(403).json({ message: "You do not have permission to delete this post" });
      }
  
      await Post.deleteOne({ _id: postID });
  
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ message: "An error occurred while deleting the post" });
    }
  });

  // Endpoint to give a rating to a post
  app.post("/posts/:postID/:userID/rate", async (req, res) => {
    try {
        const { postID, userID } = req.params;
        const { star } = req.body;
        const post = await Post.findById(postID);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user has already rated this post
        const existingRating = post.points.find(point => point.user.toString() === userID);

        if (existingRating) {
            // If the user has already rated this post, update their rating
            existingRating.star = star;
        } else {
            // If the user hasn't rated this post yet, add their rating
            post.points.push({ user: userID, star });
        }

        // Save the updated post to the database
        await post.save();

        res.status(200).json({ message: "Rating saved successfully", post });
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        res.status(500).json({ message: "An error occurred while saving the rating" });
    }
});

// Endpoint to get all ratings

app.get("/ratings", async (req, res) => {
    try {
        // Find all posts in the database
        const posts = await Post.find().populate('points.user');

        // Extract the ratings from the posts
        const ratings = posts.flatMap(post => post.points);

        // Send the ratings back to the client
        res.status(200).json(ratings);
    } catch (error) {
        // If an error occurred, send the error message back to the client
        res.status(500).json({ message: "An error occurred while fetching the ratings", error: error.message });
    }
});

// Endpoint to get each post rating from the current user
app.get("/posts/:postID/:userID/rating", async (req, res) => {
    try {
        const { postID, userID } = req.params;

        // Find the post by its ID
        const post = await Post.findById(postID);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the rating given by the user
        const userRating = post.points.find(point => point.user.toString() === userID);

        if (!userRating) {
            // If the user hasn't rated this post yet, return a default rating of 0
            return res.status(200).json({ rating: 0 });
        }

        // If the user has rated this post, return their rating
        res.status(200).json({ rating: userRating.star });
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        res.status(500).json({ message: "An error occurred while fetching the rating" });
    }
});

//Endpoint to comment on a post

app.post("/posts/:postID/:userID/comment", async (req, res) => {
    try {
        const { postID, userID } = req.params;
        const { text } = req.body;
        const post = await Post.findById(postID);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({ user: userID, text });

        await post.save();

        res.status(200).json({ message: "Comment saved successfully", post });
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        res.status(500).json({ message: "An error occurred while saving the comment" });
    }
});


//Endpoint to get all comments for a post
app.get('/posts/:postID/comments', async (req, res) => {
    try {
        const postID = req.params.postID;
        const post = await Post.findById(postID).populate('comments.user');

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const comments = post.comments.map(comment => ({
            _id: comment._id,
            text: comment.text,
            user: {
                _id: comment.user._id,
                firstname: comment.user.firstname,
                surname: comment.user.surname
            }
        }));

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the comments" });
    }
});

//Endpoint to delete a comment
app.delete('/posts/:postID/:userID/comments', async (req, res) => {
    try {
        const { postID, userID } = req.params;
        const { commentID } = req.body;

        const post = await Post.findById(postID);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentID);

        if (commentIndex === -1) {
            return res.status(402).json({ message: 'Comment not found' });
        }

        if (post.comments[commentIndex].user.toString() !== userID) {
            return res.status(403).json({ message: 'You do not have permission to delete this comment' });
        }

        post.comments.splice(commentIndex, 1);

        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the comment' });
    }
});