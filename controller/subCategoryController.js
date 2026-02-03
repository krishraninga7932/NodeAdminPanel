const Category = require("../model/Category");
const SubCategory = require("../model/subCategory");

const path = require("path");

const fs = require("fs");

const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");

const passport = require("passport");

module.exports.addSubCategory = async (req, res) => {
  try {
    let Categories = await Category.find();
    return res.render("add-subCategory", {
      adminData: req.user,
      Categories,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/add-subCategory");
  }
};

module.exports.insertSubCategory = async (req, res) => {
  try {
    let subCategoryData = await SubCategory.create(req.body);
    if (subCategoryData) {
      req.flash("success", "Category Inserted Successfully..!");
      return res.redirect("/subCategory/add-subCategory");
    } else {
      req.flash("error", "Error in Category Insert..!");
      return res.redirect("/subCategory/add-subCategory");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/add-subCategory");
  }
};

module.exports.viewSubCategory = async (req, res) => {
  try {
    let subCategoryData = await SubCategory.find({}).populate("categoryID");
    // let categoryData = await Admin.find({});
    console.log(subCategoryData);
    return res.render("view-subCategory", {
      subCategoryData,
      adminData: req.user,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

module.exports.editSubCategory = async (req, res) => {
  try {
    let subCategoryData = await SubCategory.findById(req.params.id);
    let Categories = await Category.find();

    return res.render("edit-subCategory", {
      subCategoryData,
      Categories,
      adminData: req.user,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/subCategory/view-subCategory");
  }
};

module.exports.updateSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndUpdate(req.params.id, req.body);
    req.flash("success", "Sub Category Updated Successfully!");
    return res.redirect("/subCategory/view-subCategory");
  } catch (err) {
    console.log(err);
    req.flash("error", "Error in Updating Sub Category");
    return res.redirect("/subCategory/view-subCategory");
  }
};

module.exports.delete = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);

    req.flash("success", "Sub Category Deleted Successfully!");
    return res.redirect("/subCategory/view-subCategory");
  } catch (err) {
    console.log(err);
    req.flash("error", "Error in Deleting Sub Category");
    return res.redirect("/subCategory/view-subCategory");
  }
};
