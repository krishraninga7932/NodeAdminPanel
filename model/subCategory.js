const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema(
  {
    sname: {
      type: String,
      required: true,
    },
    status: {
      type: String, 
      default: "Active",
    },
    categoryID: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategory;
