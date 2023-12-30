const express = require("express");
const router = express.Router();
const e = require("connect-flash");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");
const wrapAsync = require("../utils/wrapAsync.js");

//Signup

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(userController.signup));

//Login

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

//logout

router.get("/logout", userController.logout);

module.exports = router;
