const express = require("express");
const Listing = require("./models/listing");
const Reviews = require("./models/review");

// for check user must be loged in!

module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be loged in!");
    return res.redirect("/login");
  }
  next();
};

// for redirect user to original url!

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// for give user edit listing authorization!

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// for give user edit review authorization!

module.exports.isreviewOwner = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Reviews.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
