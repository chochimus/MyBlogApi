const logoutRouter = require("express").Router();

logoutRouter.post("/", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "logout successful" });
});

module.exports = logoutRouter;
