const blogsRouter = require("express").Router();
const { body, validationResult } = require("express-validator");
const {
  queryAllPosts,
  queryPublishedPosts,
  queryPostsById,
  queryCreatePost,
  queryDeletePost,
  queryUpdatePost,
} = require("../db/queryblogs");
const { userExtractor } = require("../utils/middleware");
const commentsRouter = require("./comments");

blogsRouter.get("/", userExtractor, async (req, res) => {
  const { includeUnpublished } = req.query;

  if (includeUnpublished) {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied." });
    }

    const blogs = await queryAllPosts();
    return res.json(blogs);
  }

  const blogs = await queryPublishedPosts();
  res.json(blogs);
});

blogsRouter.get("/:blogId", userExtractor, async (req, res) => {
  const blog = await queryPostsById(req.params.blogId);
  if (!blog) {
    return res.status(404).end();
  }
  if (!blog.published) {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied." });
    }
  }
  res.json(blog);
});

const blogValidator = [
  body("title").trim().notEmpty().withMessage("Title required").escape(),
  body("content").trim().notEmpty().withMessage("Content required"),
];

blogsRouter.put("/:blogId", userExtractor, blogValidator, async (req, res) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied." });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, published } = req.body;

  const blog = await queryUpdatePost(req.params.blogId, {
    title,
    content,
    authorId: req.user.id,
    ...(published !== undefined && { published }),
  });
  return res.status(200).json(blog);
});

blogsRouter.post("/", userExtractor, blogValidator, async (req, res) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied." });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, content, published } = req.body;

  const data = {
    title,
    content,
    authorId: req.user.id,
    published: published || false,
  };
  const blog = await queryCreatePost(data);
  return res.status(200).json(blog);
});

blogsRouter.delete("/:blogId", userExtractor, async (req, res) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied." });
  }

  await queryDeletePost(req.params.blogId);
  res.status(204).end();
});

blogsRouter.use("/:blogId/comments", commentsRouter);

module.exports = blogsRouter;
