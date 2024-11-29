const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");

const middleware = require("./utils/middleware");
const cookieParser = require("cookie-parser");
const checkLogin = require("./controllers/check-login");

//set origin and credentials to true later
app.use(
  cors({
    origin: [
      "https://precious-gingersnap-800886.netlify.app",
      "https://charming-kulfi-14d4aa.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.requestLogger);

app.use("/api/check-login", checkLogin);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
