const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const productSchema = new mongoose.Schema(
  {
    pname: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Active",
    },
    deleteStatus: {
      type: String,
      enum: ["Active", "Deleted"],
      default: "Active",
    },
    subCategoryID: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
    userID: {
      type: mongoose.Schema.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true },
);

// Multer storage
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/productImages"));
  },
  filename: (req, file, cb) => {
    cb(null, "product-" + Date.now() + path.extname(file.originalname));
  },
});

// Multer middleware
productSchema.statics.uploadProductImage = multer({
  storage: productStorage,
}).single("image");

// Model
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
