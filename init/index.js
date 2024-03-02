const mongoose = require("mongoose");
const initData = require("./data.js"); 
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => { //del test datas and inserting afresh new data from exported init data.js
  await Listing.deleteMany({});
  initData.data= initData.data.map((obj)=> ({...obj, owner: "65d4fb78bc2dbd767c83a216"})); //har ek listings obj data ko separately store krdega owner ke saath in a new array
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();