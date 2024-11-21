const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const loginRouter = require("express").Router();
const { getUserByUsername } = require("../db/queryusers");
const { userExtractor, preventIfLoggedIn } = require("../utils/middleware");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts, please try again later" },
});

const loginValidator = [
  body("username").trim().notEmpty().withMessage("Username required").escape(),
  body("password").notEmpty().withMessage("Password required"),
];

loginRouter.post(
  "/",
  userExtractor,
  preventIfLoggedIn,
  loginLimiter,
  loginValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await getUserByUsername(username);
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: "invalid credentials",
      });
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
      sameSite: "None",
    });

    res.status(200).json({ message: `Login successful` });
  }
);

module.exports = loginRouter;
