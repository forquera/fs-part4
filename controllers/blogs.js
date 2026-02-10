const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");

  response.json(blogs);
});

blogsRouter.post("", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    ...body,
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

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blogId = request.params.id;

    const user = request.user;
    const blog = await Blog.findById(blogId);

    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndDelete(blogId);

      return response.status(204).end();
    } else {
      return response
        .status(403)
        .json({ error: "only the creator can delete this blog" });
    }
  },
);

module.exports = blogsRouter;
