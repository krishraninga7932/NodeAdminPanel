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

route.get("/delete/:id",passport.checkAuthentication,ProductCtl.deleteProduct)

route.get('/view-product',passport.checkAuthentication, ProductCtl.viewProduct);

module.exports = route;
