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

module.exports.editProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id).populate({
      path: "subCategoryID",
      populate: {
        path: "categoryID"
      }
    });

    let Categories = await Category.find();
    let subCategories = await SubCategory.find();

    return res.render("edit-product", {
      product,
      Categories,
      subCategories,
      adminData: req.user,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Unable to load product");
    return res.redirect("/product/view-product");
  }
};
module.exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (req.file) {
      let oldImagePath = path.join(
        __dirname,
        "../uploads/productImages/",
        product.image
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      req.body.image = req.file.filename;
    } else {
      req.body.image = product.image;
    }

    await Product.findByIdAndUpdate(req.params.id, req.body);

    req.flash("success", "Product updated successfully!");
    return res.redirect("/product/view-product");
  } catch (err) {
    console.log(err);
    req.flash("error", "Unable to update product");
    return res.redirect("/product/view-product");
  }
};


// trash
// Show Trash Products
module.exports.trashProducts = async (req, res) => {
  try {
    let trashData = await Product.find({
      userID: req.user._id,
      deleteStatus: "Deleted",
    }).populate({
      path: "subCategoryID",
      populate: {
        path: "categoryID",
      },
    });

    return res.render("trash-products", {
      trashData,
      adminData: req.user,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Unable to load trash products");
    return res.redirect("/dashboard");
  }
};

// restore product

module.exports.restoreProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    product.deleteStatus = "Active";

    await product.save();

    req.flash("success", "Product restores successfully");
    return res.redirect("/product/trash");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    return res.redirect("/product/trash");
  }
};

// Hard Delete Product (Permanent)
module.exports.hardDeleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    // Delete image from folder
    let imagePath = path.join(
      __dirname,
      "../uploads/productImages/",
      product.image,
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete from database
    await Product.findByIdAndDelete(req.params.id);

    req.flash("success", "Product permanently deleted!");
    return res.redirect("/product/trash");
  } catch (err) {
    console.log(err);
    req.flash("error", "Unable to delete product permanently");
    return res.redirect("/product/trash");
  }
};
