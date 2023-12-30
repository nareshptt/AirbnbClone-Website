const mongoose = require("mongoose");
const initData = require("./data.js");
const mongourl = "mongodb://127.0.0.1:27017/Major";
const Listing = require("../models/listing.js");

// Connetcion to DB

main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongourl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "658d7fdffcbda4ad2475ea90",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initilized");
};

initDB();
