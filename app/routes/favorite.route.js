const express = require("express");
const userFavorite = require("../controllers/favorite.controller");

const router = express.Router();

router.route("/:id").get(userFavorite.findAll);

router.route("/add").post(userFavorite.add);

router.route("/delete").post(userFavorite.delete);

module.exports = router;
