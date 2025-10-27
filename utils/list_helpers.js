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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
