const commentsRouter = require("express").Router({ mergeParams: true });
const { body, validationResult } = require("express-validator");

const { userExtractor } = require("../utils/middleware");
const {
  queryCreateComment,
  queryCommentAuthor,
  queryDeleteComment,
} = require("../db/queryComments");
const { queryPostsById } = require("../db/queryblogs");

const commentValidator = [
  body("content").trim().notEmpty().withMessage("Content required").isString(),
];
commentsRouter.post("/", userExtractor, commentValidator, async (req, res) => {
  if (!req.user) {
    return res.status(403).json({ error: "Access denied" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const blog = await queryPostsById(req.params.blogId);
  if (!blog || !blog.published) {
    return res.status(404).json({ error: "Blog not found" });
  }

  const { content } = req.body;
  const data = {
    content,
    postId: req.params.blogId,
    userId: req.user.id,
  };
  const comment = await queryCreateComment(data);
  return res.status(200).json(comment);
});

commentsRouter.delete("/:commentId", userExtractor, async (req, res) => {
  if (!req.user) {
    return res.status(403).json({ error: "Access denied." });
  }
  const commentAuthor = await queryCommentAuthor(req.params.commentId);

  if (!commentAuthor) {
    return res.status(404).json({ error: "comment not found" });
  }

  if (req.user.id !== commentAuthor.id || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied." });
  }
  await queryDeleteComment(req.params.commentId);
  return res.status(200).json({ message: "comment succcessfully deleted" });
});

module.exports = commentsRouter;
