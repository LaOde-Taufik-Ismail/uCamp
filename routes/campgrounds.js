const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isOwner, validateCampground } = require("../midleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  // .post(
  //   isLoggedIn,
  //   validateCampground,
  //   catchAsync(campgrounds.createCampground)
  // );
  .post(upload.array("image"), (req, res) => {
    console.log(req.body, req.files);
    res.send("hwhwh it work");
  });

router.get("/new", isLoggedIn, campgrounds.new);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(isLoggedIn, validateCampground, catchAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isOwner, catchAsync(campgrounds.editForm));

module.exports = router;
