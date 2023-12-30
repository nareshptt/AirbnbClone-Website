const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsyns = require("../utils/wrapAsync.js");
const { Validatereview } = require("../controller/reviews.js");
const reviewController = require("../controller/reviews.js");
const { isLogedIn, isreviewOwner } = require("../middleware.js");

// Post Review Route

router.post("/", isLogedIn, Validatereview, wrapAsyns(reviewController.post));

// Delete Review Route

router.delete(
  "/:reviewId",
  isLogedIn,
  isreviewOwner,
  wrapAsyns(reviewController.delete)
);

module.exports = router;
