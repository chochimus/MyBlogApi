const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { createUser } = require("../db/queryusers");
const usersRouter = require("express").Router();
const { userExtractor, preventIfLoggedIn } = require("../utils/middleware");

const signupValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .isLength({ max: 20 })
    .withMessage("Username must be no more than 20 characters long")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username must only contain letters, numbers, or underscores")
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isLength({ max: 32 })
    .withMessage("Password must be less than 32 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/) // This regex checks for any special character
    .withMessage("Password must contain at least one special character"),
  body("confirm-password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

usersRouter.post(
  "/",
  userExtractor,
  preventIfLoggedIn,
  signupValidator,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(username, hashedPassword);
    res.status(201).json({ message: "User successfully created" });
  }
);

module.exports = usersRouter;
