const Campground = require("../models/campground");

(req, res) => {
  res.render("campgrounds/new");
};
module.exports.index = async (req, res) => {
  const campground = await Campground.find({});
  res.render("campgrounds/indeks", { campground });
};

module.exports.new = (req, res) => {
  res.render("campgrounds/new");
};
module.exports.createCampground = async (req, res, next) => {
  // if (!req.body.campground)
  //   throw new ExpresError("Invalid Campground Data", 404);
  const campground = new Campground(req.body.campground);
  campground.owner = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "owner" },
    })
    .populate("owner");
  if (!campground) {
    req.flash("error", "cant find the campground.....");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.editForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "cant find the campground.....");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp.owner.equals(req.user.id)) {
    req.flash("error", "you do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Successfully Update This Campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted a Campground");
  res.redirect("/campgrounds");
};
