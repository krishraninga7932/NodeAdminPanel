const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/adminPanelnode1");
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = db;