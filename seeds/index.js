const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
  .connect(
    "mongodb+srv://vaibhavi22scse1011403:JO5gPXSivffJaPn6@yelpcamp.f1cnlum.mongodb.net/?retryWrites=true&w=majority&appName=yelpCamp"
  )
  .then(() => {
    console.log("Successful connection");
  })
  .catch((err) => console.log(`Ran into: ${err}`));

const randNum = () => Math.floor(Math.random() * 500) + 1;
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const price = () => Math.floor(Math.random() * 800) + 1;

const seedData = async () => {
  // before starting, deleting all the already exiating documents
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const randNumGenerated = randNum();
    const cg = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[randNumGenerated].city}, ${cities[randNumGenerated].state}`,
      description:
        "Aenean in posuere ante, id mattis urna. Nulla diam leo, blandit quis commodo at, maximus et sapien. Suspendisse iaculis vulputate ligula, in cursus nisi pharetra id. Sed quis ipsum nibh. Donec facilisis in tortor eu varius. Phasellus faucibus mi ut justo posuere, quis viverra lorem venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur pharetra urna at pharetra. Vestibulum ullamcorper nulla et convallis molestie. Duis at tempor libero, non sagittis neque. Etiam a vestibulum tortor. Mauris at risus ut enim pretium dictum at ut urna.",
      price: price(),
      images: [
        {
          url: "https://res.cloudinary.com/dvgspy7bm/image/upload/v1693728445/YelpCamp/rqdeg2p0xpjuoyuwigqv.jpg",
          filename: "YelpCamp/rqdeg2p0xpjuoyuwigqv",
        },
      ],
      author: "64f1e2d4136d70f83aa60c85",
      geometry: {
        type: "Point",
        coordinates: [
          cities[randNumGenerated].longitude,
          cities[randNumGenerated].latitude,
        ],
      },
    });
    await cg.save();
  }
  console.log("All the data is saved");
};

seedData().then(() => mongoose.connection.close());
