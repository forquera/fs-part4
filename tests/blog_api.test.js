const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test.only("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test.only("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test.only("identifier is called id", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];

  assert(blog.id, "id field should exist");
  assert(!blog._id, "_id should not exist");
});

test.only("a valid blog cand be added", async () => {
  const newBlog = {
    title: "Esto es un nuevo blog",
    author: "Messi",
    url: "holamessi.com",
    likes: 420,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const contents = response.body.map((r) => r.title);

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
  assert(contents.includes(newBlog.title));
});

test.only("a blog without like property default to zero", async () => {
  const newBlog = {
    title: "Esto es un nuevo blog",
    author: "Messi",
    url: "holamessi.com",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const lastBlog = response.body.at(-1);

  assert.strictEqual(lastBlog.likes, 0);
});

test.only("add a invalid blog", async () => {
  const newBlog = {
    author: "Messi",
    url: "holamessi.com",
    likes: 8,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

after(async () => {
  await mongoose.connection.close();
});
