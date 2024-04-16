const MongoBD = require("../utils/mongodb.util");
const ApiError = require("../api_error");
const CartService = require("../services/cart.service");

exports.add = async (req, res, next) => {
  try {
    const cartService = new CartService(MongoBD.client);
    const document = await cartService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.error("Error add item:", error);
    return next(new ApiError(500, "An error occurred while add item"));
  }
};

exports.findAll = async (req, res) => {
  const userId = req.params.id;
  const cartService = new CartService(MongoBD.client);
  try {
    const bookId = await cartService.findAll(userId);
    res.send(bookId);
  } catch (error) {
    res.status(500).json({ error: "Failed to find user's favorites" });
  }
};

exports.removeItem = async (req, res, next) => {
  const { userId, bookId } = req.body;
  try {
    const cartService = new CartService(MongoBD.client);
    await cartService.removeItem(userId, bookId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error removing item:", error);
    return next(new ApiError(500, "An error occurred while removing item"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const cartService = new CartService(MongoBD.client);
    await cartService.deleteCart(req.params.id);
    res.send("delete success");
  } catch (error) {
    return next(new ApiError(500, "An erroe occurred while removing cart"));
  }
};
