const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Esto es una prueba",
    author: "Fernando",
    url: "holamundo.com",
    likes: 66,
  },
  {
    title: "Esto es otra prueba",
    author: "Messi",
    url: "holamessi.com",
    likes: 420,
  },
];

const nonExistingId = async () => {
  const note = new Blog({
    title: "Esto se borrara",
    author: "Scream",
    url: "holamscream.com",
    likes: 69,
  });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

const blogsInDb = async () => {
  const notes = await Blog.find({});
  return notes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
