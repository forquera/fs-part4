const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((acc, blog) => {
    return acc + blog.likes;
  }, 0);

  return total;
};

module.exports = {
  dummy,
  totalLikes,
};
