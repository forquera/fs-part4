const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");

  response.json(blogs);
});

blogsRouter.post("", async (request, response) => {
  // Busco el primer usuario
  const user = await User.findOne({});

  const blog = new Blog({
    ...request.body,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.get("/:id", async (request, response) => {
  const blogId = request.params.id;
  const blog = await Blog.findById(blogId);

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const blogId = request.params.id;
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const opts = { runValidators: true, new: true };

  const updateBlog = await Blog.findByIdAndUpdate(blogId, blog, opts);

  if (updateBlog) {
    response.json(updateBlog);
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
