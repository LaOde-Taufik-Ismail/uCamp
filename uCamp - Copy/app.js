const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpresError = require("./utils//ExpressError");
const methodOverride = require("method-override");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

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

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

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
