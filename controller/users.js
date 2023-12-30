const User = require("../models/user.js");

//Signup

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerdUser = await User.register(newUser, password);
    req.login(registerdUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to techtryst");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//login

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to techtryst");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//logout

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Your loged out!");
    res.redirect("/listings");
  });
};
