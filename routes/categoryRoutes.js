const express = require("express");

const route = express.Router();

const passport = require("passport");

const categoryCtl = require("../controller/categoryController");

route.get(
  "/add-category",
  passport.checkAuthentication,
  categoryCtl.addCategory,
);

route.post(
  "/insertCategory",
  passport.checkAuthentication,
  categoryCtl.insertCategory,
);

route.get(
  "/view-category",
  passport.checkAuthentication,
  categoryCtl.viewCategory,
);

route.get(
  "/delete/:id",
  passport.checkAuthentication,
  categoryCtl.deleteCategory,
);

route.get(
  "/edit-category/:id",
  passport.checkAuthentication,
  categoryCtl.editCategory,
);

route.post(
  "/update-category/:id",
  passport.checkAuthentication,
  categoryCtl.updateCategory,
);

module.exports = route;
