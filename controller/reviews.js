const ExpressError = require("../utils/Expresserror.js");
const { reviewSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");

// ValidateviewSchema

module.exports.Validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errormsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errormsg);
  } else {
    next();
  }
};

// Post Review Route

module.exports.post = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new Reviews(req.body.review);
  newreview.author = req.user._id;
  listing.reviews.push(newreview);

  await listing.save();
  await newreview.save();

  res.redirect(`/listings/${listing._id}`);
};

// Delete Review Route

module.exports.delete = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Reviews.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};
