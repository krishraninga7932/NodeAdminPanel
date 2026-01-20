const Admin = require("../model/Admin");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

/* ================= DASHBOARD ================= */
module.exports.dashboard = async (req, res) => {
  try {
    const adminData = req.user;
    res.render("dashboard", { adminData });
  } catch (err) {
    console.log(err);
  }
};

/* ================= ADD ADMIN PAGE ================= */
module.exports.addAdmin = async (req, res) => {
  try {
    let adminData = await Admin.findById(req.user._id);
    return res.render("add-admin", {
      adminData,
      adminRecord: adminData,
    });
  } catch (err) {
    return res.redirect("/");
  }
};

/* ================= INSERT ADMIN ================= */
module.exports.insertAdminData = async (req, res) => {
  try {
    await Admin.create({
      name: req.body.fname + " " + req.body.lname,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      hobby: Array.isArray(req.body.hobby) ? req.body.hobby : [req.body.hobby],
      desc: req.body.desc,
      avtar: req.file ? Admin.adPath + "/" + req.file.filename : "",
    });
    req.flash("success", "Admin Added Successfully");
    res.redirect("/add-admin");
  } catch (err) {
    req.flash("error", "Something went wrong");
    console.log(err);
  }
};

/* ================= VIEW ADMINS ================= */
module.exports.viewAdmin = async (req, res) => {
  try {
    const adminList = await Admin.find({});
    const adminData = req.user;

    res.render("view-admin", {
      adminData,
      adminList,
    });
  } catch (err) {
    console.log(err);
  }
};

/* ================= DELETE ADMIN ================= */
module.exports.deleteAdmin = async (req, res) => {
  try {
    let adminId = req.params._id;
    let adminData = await Admin.findById(adminId);

    if (adminData.avtar) {
      let imagePath = path.join(__dirname, "..", adminData.avtar);
      try {
        fs.unlinkSync(imagePath);
      } catch (e) {}
    }

    await Admin.findByIdAndDelete(adminId);
    res.redirect("/view-admin");
  } catch (err) {
    console.log(err);
  }
};

/* ================= EDIT ADMIN ================= */
module.exports.editAdmin = async (req, res) => {
  try {
    let adminId = req.params.id;
    let oldAdminData = await Admin.findById(adminId);
    const adminData = req.user;

    res.render("edit-admin", { oldAdminData, adminData });
  } catch (err) {
    console.log(err);
  }
};

/* ================= UPDATE ADMIN ================= */
module.exports.updateAdmin = async (req, res) => {
  try {
    let adminId = req.params.id;
    let oldAdminData = await Admin.findById(adminId);

    req.body.name = req.body.fname + " " + req.body.lname;

    if (req.file) {
      if (oldAdminData.avtar) {
        let oldPath = path.join(__dirname, "..", oldAdminData.avtar);
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {}
      }
      req.body.avtar = Admin.adPath + "/" + req.file.filename;
    }

    await Admin.findByIdAndUpdate(adminId, req.body);
    res.redirect("/view-admin");
  } catch (err) {
    console.log(err);
  }
};

/* ================= LOGIN PAGE ================= */
module.exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  return res.render("login");
};

/* ================= LOGOUT ================= */
module.exports.signout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }

    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        return res.redirect("/");
      }

      // clear the session cookie
      res.clearCookie("adminPanel");
      return res.redirect("/");
    });
  });
};

/* ================= CHANGE PASSWORD PAGE ================= */
module.exports.changePassword = async (req, res) => {
  try {
    const adminData = await Admin.findById(req.user._id);
    res.render("change-password", { adminData });
  } catch (err) {
    console.log(err);
  }
};

/* ================= CHECK CHANGE PASSWORD ================= */
module.exports.checkChangePassword = async (req, res) => {
  try {
    let oldPass = req.user.password;
    let adminId = req.user._id;
    if (oldPass == req.body.currentPass) {
      if (oldPass !== req.body.npassword) {
        if (req.body.npassword == req.body.cpassword) {
          let adminData = await Admin.findByIdAndUpdate(adminId, {
            password: req.body.npassword,
          });
          if (adminData) {
            console.log("Password Change Successfully..");
            return res.redirect("/signout");
          }
        } else {
          console.log("New Password and Confirm password not Same..");
          return res.redirect("/");
        }
      } else {
        console.log("Old Password and New Password Same..");
        return res.redirect("/");
      }
    } else {
      console.log("Current Password Could not Match..");
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};

/* ================= PROFILE ================= */
module.exports.profile = async (req, res) => {
  try {
    const adminData = req.user;
    res.render("profile", { adminData });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

/* ================= FORGOT PASSWORD ================= */
module.exports.forgotPasswordPage = (req, res) => {
  res.render("forgotPassword/forgot-password");
};

/* ================= SEND OTP ================= */
module.exports.sendOtp = async (req, res) => {
  try {
    let checkEmailId = await Admin.findOne({ email: req.body.email });
    if (!checkEmailId) return res.redirect("/");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "7932krishraninga@gmail.com",
        pass: "kbdcizwpolgpspua",
      },
    });

    const OTP = Math.floor(100000 + Math.random() * 900000);

    // OTP can use cookies (not auth cookies)
    res.cookie("OTP", OTP);
    res.cookie("Email", req.body.email);

    const info = await transporter.sendMail({
      from: "<7932krishraninga@gmail.com>",
      to: req.body.email,
      subject: "OTP from Admin Panel",
      html: `<b>Your OTP is : ${OTP}</b>`,
    });

    if (info.messageId) {
      return res.redirect("/verify-otp");
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

/* ================= VERIFY OTP PAGE ================= */
module.exports.verifyOtpPage = (req, res) => {
  res.render("forgotPassword/verify-otp");
};
