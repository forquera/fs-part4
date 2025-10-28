const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((acc, blog) => {
    return acc + blog.likes;
  }, 0);

  return total;
};

const favoriteBlog = (blogs) => {
  if (blogs.length == 0) {
    return [];
  }

  const blog = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max;
  });

  return blog;
};

const mostBlogs = (blogs) => {
  if (!blogs.length) return null;

  const grouped = _.groupBy(blogs, "author");
  const counted = _.map(grouped, (items, author) => ({
    author: author,
    blogs: items.length,
  }));

  return _.maxBy(counted, "blogs");
};

const mostLikes = (blogs) => {
  if (!blogs.length) return null;

  const grouped = _.groupBy(blogs, "author");
  const counted = _.map(grouped, (items, author) => ({
    author: author,
    likes: items.reduce((acc, item) => acc + item.likes, 0),
  }));

  return _.maxBy(counted, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
