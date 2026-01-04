const express = require("express");

const route = express.Router();

const adminCtl = require("../controller/adminController");

const Admin = require("../model/Admin");

const authMid = require("../middlewares/authMiddleware");

route.get("/", adminCtl.login);
route.get("/dashboard", adminCtl.dashboard);

route.get("/add-admin", adminCtl.addAdmin);

route.post(
  "/insertAdminData",
  Admin.uploadAdminImages,
  adminCtl.insertAdminData
);

route.get("/view-admin", adminCtl.viewAdmin);

route.get("/deleteAdmin/:_id", adminCtl.deleteAdmin);

route.get("/editAdmin/:id", adminCtl.editAdmin);

route.post("/updateAdmin/:id", Admin.uploadAdminImages, adminCtl.updateAdmin);

// login
route.post("/login", adminCtl.loginGeneral);

module.exports = route;
