if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
// const mongourl = "mongodb://127.0.0.1:27017/Major";
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/Expresserror.js");
const reviews = require("./routes/reviews.js");
const listings = require("./routes/lists.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.MONGODB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SEC,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in Mongo DB:", err);
});

// Database Connection

main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = {
  store,
  secret: process.env.SEC,
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOption));
app.use(flash());

// For Authentication

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  // res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});
// // app.get("/register", async (req, res) => {
// //   let FackeUser = new User({
// //     email: "naresh@gmail.com",
// //     username: "nareshpt",
// //   });

//   let registerdUser = await User.register(FackeUser, "1234");
//   res.send(registerdUser);
// });

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);

//for get data

// app.get("/test", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Something went wrong " } = err;
  res.status(statuscode).render("error.ejs", { err });
  // res.status(statuscode).send(message);
});

// Server

port = 3000;
app.listen(port, (req, res) => {
  console.log(`Server is listeningto port:${port}`);
});
