const express = require("express");

const route = express.Router();

const adminCtl = require("../controller/adminController");

const Admin = require("../model/Admin");

const passport = require("passport");

route.get("/", adminCtl.login);
route.get("/dashboard", passport.checkAuthentication, adminCtl.dashboard);

route.get("/add-admin", passport.checkAuthentication, adminCtl.addAdmin);

route.post(
  "/insertAdminData",
  passport.checkAuthentication,
  Admin.uploadAdminImages,
  adminCtl.insertAdminData
);

route.get("/view-admin", passport.checkAuthentication, adminCtl.viewAdmin);

route.get(
  "/deleteAdmin/:_id",
  passport.checkAuthentication,
  adminCtl.deleteAdmin
);

route.get("/editAdmin/:id", passport.checkAuthentication, adminCtl.editAdmin);

route.post(
  "/updateAdmin/:id",
  passport.checkAuthentication,
  Admin.uploadAdminImages,
  adminCtl.updateAdmin
);

// login
route.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
  }),
  (req, res) => {
    req.flash("success", "Login Successful");
    return res.redirect("/dashboard");
  }
);

route.get("/signout", adminCtl.signout);
route.get(
  "/changePassword",
  passport.checkAuthentication,
  adminCtl.changePassword
);
route.post(
  "/checkChangePassword",
  passport.checkAuthentication,
  adminCtl.checkChangePassword
);
route.get("/profile", passport.checkAuthentication, adminCtl.profile);

// forgot password
route.get("/forgot-password", adminCtl.forgotPasswordPage);
route.post("/send-otp", adminCtl.sendOtp);

route.get("/verify-otp", adminCtl.verifyOtpPage);
// route.post("/verify-otp", adminCtl.verifyOtp);

// route.get("/reset-password", adminCtl.resetPasswordPage);
// route.post("/reset-password", adminCtl.resetPassword);






// category routes
route.use("/category",require("./categoryRoutes"));

// SubCategory routes
route.use("/subcategory",require("./subCategoryRoutes"));




module.exports = route;
