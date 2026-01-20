const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    pname: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Active",
    },
    subCategoryID: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
