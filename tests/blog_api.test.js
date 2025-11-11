const { test, after, beforeEach, describe } = require("node:test");
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

describe.only("when there is initially some blogs saved", () => {
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
});

test.only("identifier is called id", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];

  assert(blog.id, "id field should exist");
  assert(!blog._id, "_id should not exist");
});

describe.only("viewing a specific blog", () => {
  test.only("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(resultBlog.body, blogToView);
  });

  test.only("fails with status 404 if blog does not exist", async () => {
    const validNonExistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${validNonExistingId}`).expect(404);
  });

  test.only("fails with statuscode 400 id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe.only("addition of a new note", () => {
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
});

describe.only("updating a existing blog", () => {
  test.only("updating a blog successfully", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      ...blogToUpdate,
      author: "Eddie Vedder",
      likes: blogToUpdate.likes + 5,
    };

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(result.body, updatedBlog);
  });

  test.only("returns 404 if blog to update does not exist", async () => {
    const nonExistingId = await helper.nonExistingId();

    const updateData = {
      title: "Esto es para prueba",
      author: "Scream",
      url: "holamscream.com",
      likes: 3,
    };

    await api.put(`/api/blogs/${nonExistingId}`).send(updateData).expect(404);
  });

  test.only("returns 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    const updateData = {
      title: "Esto es para prueba",
      author: "Scream",
      url: "holamscream.com",
      likes: 3,
    };

    await api.put(`/api/blogs/${invalidId}`).send(updateData).expect(400);
  });
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

after(async () => {
  await mongoose.connection.close();
});
