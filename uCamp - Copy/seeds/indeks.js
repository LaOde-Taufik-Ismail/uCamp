const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const ran1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[ran1000].city},${cities[ran1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};

seedDb();
