import Post from "../models/Post.js";
import User from "../models/User.js";

//CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;

    //find user based on id
    const user = await User.findById(userId);

    //create new post with updated information
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    //saves new post into mongo db
    await newPost.save();

    //gets all posts from mongo db
    const posts = await Post.find();

    //return all posts to render all new posts
    //201 successfully created
    res.status(201).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//READ
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    //200 successful request
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const userPosts = await Post.find({ userId });

    //200 successful request
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    //true or false
    //map prototype
    //set(userid, boolean)
    const isLiked = post.likes.get(userId);
    if (isLiked) {
        post.likes.delete(userId);
    } else {
        post.likes.set(userId, true);
    };

    //new:true updates and returns updated document
    const updatedPost = await Post.findByIdAndUpdate(id, {likes: post.likes}, {new: true});
    //send back updated post to front end
    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
