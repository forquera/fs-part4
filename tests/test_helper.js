const Blog = require("../models/blog");

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
  const note = new Blog({ title: "willremovethissoon" });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

const blogsInDb = async () => {
  const notes = await Blog.find({});
  return notes.map((note) => note.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
