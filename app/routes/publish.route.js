const express = require("express");
const publish = require("../controllers/public.controller");

const router = express.Router();

router.route("/add").post(publish.create);

router.route("/").get(publish.findAll).delete(publish.deleteAll);

router
  .route("/:id")
  .get(publish.findById)
  .post(publish.update)
  .delete(publish.delete);

module.exports = router;
