const express = require("express");

const route = express.Router();

const passport = require("passport");

const Product = require("../model/Product");

const ProductCtl = require("../controller/productController");

route.get("/add-product", passport.checkAuthentication, ProductCtl.addProduct);

route.post(
  "/insertProduct",
  passport.checkAuthentication,
  Product.uploadProductImage,
  ProductCtl.insertProduct,
);

route.get(
  "/delete/:id",
  passport.checkAuthentication,
  ProductCtl.deleteProduct,
);

route.get(
  "/view-product",
  passport.checkAuthentication,
  ProductCtl.viewProduct,
);

// Trash page
route.get("/trash", passport.checkAuthentication, ProductCtl.trashProducts);

// Restore product
route.get(
  "/restore/:id",
  passport.checkAuthentication,
  ProductCtl.restoreProduct,
);

// Hard delete product
route.get(
  "/hard-delete/:id",
  passport.checkAuthentication,
  ProductCtl.hardDeleteProduct,
);

// edit
route.get("/edit/:id", passport.checkAuthentication, ProductCtl.editProduct);
// Update product
route.post(
  "/update/:id",
  passport.checkAuthentication,
  Product.uploadProductImage,
  ProductCtl.updateProduct,
);

module.exports = route;
