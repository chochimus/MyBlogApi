const { userExtractor } = require("../utils/middleware");

const checkLogin = require("express").Router();

checkLogin.get("/", userExtractor, (req, res) => {
  if (req.user) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = checkLogin;
