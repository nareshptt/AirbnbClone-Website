const express = require("express");
const router = express.Router();
const wrapAsyns = require("../utils/wrapAsync.js");
const { isLogedIn, isOwner } = require("../middleware.js");
const { validatelisting } = require("../controller/listings.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// index Route

router.get("/", wrapAsyns(listingController.index));

// New listings

router.get("/new", isLogedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Create new list

router.post(
  "/",
  isLogedIn,
  validatelisting,
  upload.single("listing[image]"),
  wrapAsyns(listingController.rendernewform)
);

// Edit Route

router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
  validatelisting,
  wrapAsyns(listingController.edit)
);

// Update Route

router.put(
  "/:id",
  isLogedIn,
  isOwner,
  validatelisting,
  upload.single("listing[image]"),
  wrapAsyns(listingController.update)
);

// Delete Route

router.delete("/:id", isLogedIn, isOwner, wrapAsyns(listingController.delete));

// Show Route

router.get("/:id", wrapAsyns(listingController.show));

module.exports = router;
