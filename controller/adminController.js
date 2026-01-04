const Admin = require("../model/Admin");

const path = require("path");

const fs = require("fs");

const bcrypt = require("bcrypt");

module.exports.login = (req, res) => {
  try {
    if (req.cookies.admin) {
      return res.redirect("/dashboard");
    } else {
      return res.render("login");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.dashboard = async (req, res) => {
  try {
    if (req.cookies.admin == undefined) {
      return res.redirect("/");
    }

    const adminData = await Admin.findById(req.cookies.admin._id);
    res.render("dashboard", { adminData });
  } catch (err) {
    console.log(err);
  }
};
module.exports.addAdmin = async (req, res) => {
  try {
    if (req.cookies.admin == undefined) {
      return res.redirect("/");
    }

    const adminData = await Admin.findById(req.cookies.admin._id);
    res.render("add-admin", { adminData });
  } catch (err) {
    console.log(err);
  }
};

module.exports.insertAdminData = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    const { name, email, password, gender, hobby, desc } = req.body;

    await Admin.create({
      name: req.body.fname + " " + req.body.lname,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      hobby: Array.isArray(req.body.hobby) ? req.body.hobby : [req.body.hobby],
      desc: req.body.desc,
      avtar: req.file ? Admin.adPath + "/" + req.file.filename : "",
    });

    return res.redirect("/add-admin");
  } catch (err) {
    console.log(err);
  }
};

module.exports.viewAdmin = async (req, res) => {
  try {
    if (req.cookies.admin == undefined) {
      return res.redirect("/");
    }
    const adminList = await Admin.find();
    const adminData = await Admin.findById(req.cookies.admin._id);
    if (adminData) {
      return res.render("view-admin", {
        adminData,
        adminList,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.deleteAdmin = async (req, res) => {
  try {
    let adminId = req.params._id;

    let adminData = await Admin.findById(adminId);

    if (adminData) {
      let imagePath = path.join(__dirname, "..", adminData.avtar);
      try {
        await fs.unlinkSync(imagePath);
      } catch (err) {
        console.log(err);
      }
      let deleteAd = await Admin.findByIdAndDelete(adminId);
      if (deleteAd) {
        console.log("Admin Deleted Successfully..");
        return res.redirect("/view-admin");
      } else {
        console.log("Error in Deleting Admin..");
        return res.redirect("/view-admin");
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.editAdmin = async (req, res) => {
  try {
    let adminId = req.params.id;
    let oldAdminData = await Admin.findById(adminId);

    if (oldAdminData) {
      return res.render("edit-admin", { oldAdminData });
    } else {
      console.log("Record Not Found..");
      return res.redirect("/view-admin");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateAdmin = async (req, res) => {
  try {
    let adminId = req.params.id;
    let oldAdminData = await Admin.findById(adminId);
    if (oldAdminData) {
      req.body.name = req.body.fname + " " + req.body.lname;
      req.body.avtar = "";
      if (req.file) {
        if (oldAdminData.avtar) {
          let oldPath = path.join(__dirname, "..", oldAdminData.avtar);
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.log(err);
          }
        }

        req.body.avtar = Admin.adPath + "/" + req.file.filename;
      } else {
        req.body.avtar = req.file;
      }

      let newadminData = await Admin.findByIdAndUpdate(adminId, req.body);
      if (newadminData) {
        console.log("Admin Record Updated Successfully..");
        return res.redirect("/view-admin");
      } else {
        console.log("Something Wrong..");
        return res.redirect("back");
      }
    } else {
      console.log("Record Not Found..");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
  }
};

// login logic
module.exports.loginGeneral = async (req, res) => {
  try {
    let checkEmail = await Admin.findOne({ email: req.body.email });
    if (checkEmail) {
      if (checkEmail.password == req.body.password) {
        res.cookie("admin", checkEmail, {
          maxAge: 1000 * 60 * 60 * 10,
        });
        return res.redirect("/dashboard");
      } else {
        return res.redirect("/");
      }
    } else {
      console.log("Email I'D is Invalid");
      return res.redirect("/");
    }
  } catch (err) {
    console.log("Something Went Wrong", err);
    res.redirect("/");
  }
};
