const express = require("express");

const route = express.Router();

const passport = require("passport");

const SubCategoryCtl = require("../controller/subCategoryController");

route.get(
  "/add-subCategory",
  passport.checkAuthentication,
  SubCategoryCtl.addSubCategory,
);

route.post(
  "/insertsubCategory",
  passport.checkAuthentication,
  SubCategoryCtl.insertSubCategory,
);

route.get(
  "/view-subCategory",
  passport.checkAuthentication,
  SubCategoryCtl.viewSubCategory,
);

route.get(
  "/edit-subCategory/:id",
  passport.checkAuthentication,
  SubCategoryCtl.editSubCategory,
);

route.post(
  "/update-subCategory/:id",
  passport.checkAuthentication,
  SubCategoryCtl.updateSubCategory,
);

route.get(
  "/delete/:id",
  passport.checkAuthentication,
  SubCategoryCtl.delete
);


module.exports = route;
