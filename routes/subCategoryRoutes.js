const express = require('express');

const route = express.Router();

const passport = require('passport');

const SubCategoryCtl = require('../controller/subCategoryController');

route.get('/add-subCategory',passport.checkAuthentication, SubCategoryCtl.addSubCategory);

route.post('/insertsubCategory',passport.checkAuthentication, SubCategoryCtl.insertSubCategory);

route.get('/view-subCategory',passport.checkAuthentication, SubCategoryCtl.viewSubCategory);

module.exports = route;