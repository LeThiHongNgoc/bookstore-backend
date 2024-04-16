const express = require("express");
const carts = require("../controllers/cart.controller");

const router = express.Router();

router.route("/:id").delete(carts.delete).get(carts.findAll);

router.route("/add").post(carts.add);

router.route("/delete").post(carts.removeItem);

module.exports = router;
