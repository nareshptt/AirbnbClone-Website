const Listing = require("../models/listing");
const ExpressError = require("../utils/Expresserror.js");
const { listingSchema } = require("../Schema.js");

// ValidatelistingSchema

module.exports.validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errormsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errormsg);
  } else {
    next();
  }
};

// index

module.exports.index = async (req, res) => {
  let listing = await Listing.find();
  res.render("listings/home.ejs", { listing });
};

// new

module.exports.rendernewform = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  await newlisting.save();
  req.flash("success", " New listing Created!");
  res.redirect("/listings");
};

//Edit

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
};

// Update

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "  listing Updated!");
  res.redirect(`/listings/${id}`);
};

// Delete

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", " listing Deleted!");
  res.redirect("/listings");
};

// Show

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  res.render("listings/show.ejs", { listing });
  console.log(listing);
};
