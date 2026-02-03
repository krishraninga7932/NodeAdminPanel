const express = require("express");

const app = express();

const port = 9000;

const flash = require("connect-flash");

const path = require("path");
const db = require("./config/db");
db();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const session = require("express-session");
const passport = require("passport");
const passportjs = require("./config/passport");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "assets")));

app.use(express.urlencoded());

app.use(
  session({
    name: "adminPanel",
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 10,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use((req, res, next) => {
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  next();
});
 
app.use("/", require("./routes/adminRoutes"));

// upload for images for view
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, (err) => {
  if (err) {
    console.log("There is an error");
  } else {
    console.log("App Started at port:", port);
  }
});
