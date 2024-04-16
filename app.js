const express = require("express");
const cors = require("cors");
const booksRouter = require("./app/routes/book.route");
const usersRouter = require("./app//routes/user.route");
const cartRouter = require("./app/routes/cart.route");
const borrowRouter = require("./app/routes/borrowed.route");
const favoriteRouter = require("./app/routes/favorite.route");
const publishRouter = require("./app/routes/publish.route");
const ApiError = require("./app/api_error");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", booksRouter);
app.use("/api/users", usersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/borrow", borrowRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/publish", publishRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bookstore application." });
});

// handle 404 response
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
