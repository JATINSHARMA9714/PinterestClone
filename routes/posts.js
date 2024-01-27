const mongoose = require('mongoose');


// Define the Post schema
const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true
  },
  postImage:{
    type: String,
    required: true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Array,
    default: []
  }
});

// Create the Post model using the schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
