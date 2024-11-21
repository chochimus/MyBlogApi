const { getUserById } = require("../db/queryusers");
const logger = require("./logger");
const jwt = require("jsonwebtoken");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("---");
  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.cookies?.token || null;

  if (!token) {
    req.user = null;
    return next();
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalud" });
  }
  const user = await getUserById(decodedToken.id);
  if (!user) {
    return response.status(401).json({ error: "user not found" });
  }
  req.user = user;
  next();
};

const preventIfLoggedIn = (req, res, next) => {
  if (req.user) {
    return res.status(400).json({ error: "You are already logged in" });
  }
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  if (error.code === "P2002") {
    return res.status(400).json({ error: "username unavailable" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token missing or invalid" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }
  logger.error(error);
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor,
  preventIfLoggedIn,
};
