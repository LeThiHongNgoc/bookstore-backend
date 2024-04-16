const BorrowBooks = require("../services/borrowed.service");
const MongoBD = require("../utils/mongodb.util");
const ApiError = require("../api_error");

// Add borrow books
exports.create = async (req, res, next) => {
  try {
    const borrowBooks = new BorrowBooks(MongoBD.client);
    const document = await borrowBooks.create(req.body);
    return res.send(document);
  } catch (error) {
    console.error("Error creating borrow:", error);
    return next(
      new ApiError(500, "An error occurred while creating the borrow")
    );
  }
};

// Find by ID
exports.findOne = async (req, res) => {
  const userId = req.params.id;
  try {
    const borrowBooks = new BorrowBooks(MongoBD.client);
    const borrowedList = await borrowBooks.findById(userId);
    return res.send(borrowedList);
  } catch (error) {
    console.error("Error finding borrowed books:", error);
    return res
      .status(500)
      .send({ error: "An error occurred while finding borrowed books" });
  }
};

// Find all Borrow
exports.findAll = async (req, res, next) => {
  let document = [];

  try {
    const borrowBooks = new BorrowBooks(MongoBD.client);
    document = await borrowBooks.find({});
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An errer occured while retrieving borrow books")
    );
  }
};

// Edit Borrow Books
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length < 0) {
    return next(new ApiError(400, "Data to update can not be emtpy"));
  }
  try {
    const borrowBooks = new BorrowBooks(MongoBD.client);
    const document = await borrowBooks.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Borrow not found"));
    }
    return res.send({ message: "Borrow was update successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating borrow with id=${req.params.id}`)
    );
  }
};
