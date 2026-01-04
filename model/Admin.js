const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  hobby: {
    type: Array,
  },
  desc: {
    type: String,
    required: true,
  },
  avtar: {
    type: String,
    required: true,
  },
});

const adminStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/adminImages"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

AdminSchema.statics.uploadAdminImages = multer({
  storage: adminStorage,
}).single("avtar");

AdminSchema.statics.adPath = "/uploads/adminImages";

module.exports = mongoose.model("Admin", AdminSchema);
