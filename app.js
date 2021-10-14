if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log(process.env.SECRET);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpresError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

mongoose
  .connect(" mongodb://127.0.0.1:27017/GoCamp")
  .then(() => {
    console.log("LINK MONGGO");
  })
  .catch((error) => handleError(error));

const db = mongoose.connection;
db.on("error", console.log.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisisshouldbethesecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/fakeuser", async (req, res) => {
  const user = new User({ email: "colt2gmail.com", username: "colt" });
  const newUser = await User.register(user, "chicken");
  res.send(newUser);
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpresError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "somthing is error" } = err;
  if (!err.message) {
    err.message = "Ohh boy something is going wrong";
  }
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("====================================");
  console.log("Menjalankan ");
  console.log("====================================");
});
