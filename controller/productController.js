const Category = require("../model/Category");
const SubCategory = require("../model/subCategory");
const Product = require("../model/Product");

const path = require("path");

const fs = require("fs");

const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");

const passport = require("passport");

module.exports.addProduct = async (req, res) => {
  try {
    let Categories = await Category.find();
    let subCategories = await SubCategory.find();
    return res.render("add-product", {
      adminData: req.user,
      subCategories,
      Categories,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/add-product");
  }
};

module.exports.insertProduct = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.filename;
    }
    req.body.userID = req.user._id;
    let product = await Product.create({
      ...req.body,
    });

    if (product) {
      req.flash("success", "Product added successfully!");
      return res.redirect("/product/add-product");
    } else {
      req.flash("error", "Product not added!");
      return res.redirect("/product/add-product");
    }
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong!");
    return res.redirect("/product/add-product");
  }
};

module.exports.viewProduct = async (req, res) => {
  try {
    let productData = await Product.find({
      userID: req.user._id,
      deleteStatus: "Active",
    }).populate({
      path: "subCategoryID",
      populate: {
        path: "categoryID",
      },
    });
    return res.render("view-product", {
      productData,
      adminData: req.user,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Unable to load products");
    return res.redirect("/dashboard");
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    product.deleteStatus = "Deleted";

    await product.save();

    req.flash("success", "Product moved to trash");
    return res.redirect("/product/view-product");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    return res.redirect("/product/view-product");
  }
};
