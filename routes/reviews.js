const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const review = require("../controllers/reviews");
const { validateReview, isLoggedIn, isReviewOwner } = require("../midleware");

router.post("/", isLoggedIn, validateReview, catchAsync(review.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  catchAsync(review.deleteReview)
);

module.exports = router;
