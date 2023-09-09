const User = require('../models/UserModel');
const Blog = require(`../models/BlogModel`)
const jwt = require('jsonwebtoken')
const multer = require('multer');
const router = require("express").Router();
const blogCtrl = {};

const singleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

blogCtrl.uploadSingle = multer({ storage: singleStorage });


//CREATE Blog
blogCtrl.createBlog = async (req, res) => {

    const { title, description, username, tag1, tag2, userId } = req.body;
    try {
        if (req.file) {
            const image = req.file.originalname;
            console.log(image)
            const newBlog = new Blog({
                title, description, username, tags: [tag1, tag2], userId, image
            })
            const savedBlog = await newBlog.save();
            res.status(200).json(savedBlog);
        }
        else {
            const newBlog = new Blog({
                title, description, username, tags: [tag1, tag2], userId
            })
            const savedBlog = await newBlog.save();
            res.status(200).json(savedBlog);
        }

    } catch (err) {
        res.status(500).json(err)
    }
}

//UPDATE Blog
blogCtrl.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        const { title, description, username, tag1, tag2, userId } = req.body;

        const updateProps = {title, description, tags: [tag1, tag2], userId}

        if(req.file){
            updateProps.image = req.file.originalname;
        }

        const user = await User.findById(userId)

        if (blog.username === username || blog.userId === userId || user.role === 'admin') {
            try {
                const updatedBlog = await Blog.findByIdAndUpdate(req.params.id,
                    {
                        $set: updateProps
                    },
                    { new: true });

                res.status(200).json(updatedBlog);
            } catch (err) {
                console.log(err)

                res.status(500).json(err)
            }

        }
        else {
            res.status(403).json("You can update only your Blog!")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

//DELETE Blog
blogCtrl.deleteBlog = async (req, res) => {
    const {username, userId} = req.body;
    const blogId = req.params.id;
    console.log({username, userId})
    console.log(blogId)
    try {
        const blog = await Blog.findById(req.params.id);
        const user = await User.findById(userId)

        console.log(blog)
        if (blog.username === username || blog.userId === userId || user.role === 'admin') {
            try {
                await Blog.findByIdAndDelete(blog._id);
                res.status(200).json("blog has been deleted")
            } catch (err) {
                res.status(500).json(err)
            }
        }
        else {
            res.status(403).json("You can delete only your Blog!")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

//GET Blog
blogCtrl.getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        res.status(200).json(blog);

    } catch (err) {
        res.status(500).json(err);
    }
}

//GET ALL Blogs
blogCtrl.getAllBlogs = async (req, res) => {
    const username = req.query.user;
    const tagName = req.query.tag;
    const userId = req.query.uId;
    const search = req.query.squery;

    try {
        let blogs;

        if (search) {
            const regex = new RegExp(search, 'i')
            blogs = await Blog.find({ title: { $regex: regex } });
            console.log(blogs)
        }
        else if (username) {
            blogs = await Blog.find({ username });
        }
        else if (tagName) {
            blogs = await Blog.find(
                {
                    tags: {
                        $in: [tagName],
                    }
                }
            )
        }
        else if (userId) {
            blogs = await Blog.find({ userId: userId });

        }
        else {
            blogs = await Blog.find();
        }
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json(err);
    }
};


module.exports = blogCtrl;


