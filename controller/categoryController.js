const Category = require("../model/Category");

const path = require("path");

const fs = require("fs");

const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");

const passport = require("passport");

module.exports.addCategory = async (req, res) => {
  try {
    return res.render("add-category", {
      adminData: req.user,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/add-category");
  }
};

module.exports.insertCategory = async (req, res) => {
  try {
    let categoryData = await Category.create(req.body);
    if (categoryData) {
      req.flash("success", "Category Inserted Successfully..!");
      return res.redirect("/category/add-category");
    } else {
      req.flash("error", "Error in Category Insert..!");
      return res.redirect("/category/add-category");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/add-category");
  }
};

module.exports.viewCategory = async (req, res) => {
  try {
    let categoryData = await Category.find({});
    // let categoryData = await Admin.find({});
    console.log(categoryData);
    return res.render("view-category", {
      categoryData,
      adminData: req.user,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    // let category = await Category.findById(req.params.id);

    // Delete from database
    await Category.findByIdAndDelete(req.params.id);

    req.flash("success", "Product permanently deleted!");
    return res.redirect("/category/view-category");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    return res.redirect("/category/view-category");
  }
};
