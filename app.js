const express = require("express");

const app = express();

const port = 9000;

const path = require("path");
const db = require("./config/db");
db();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "assets")));

app.use(express.urlencoded());

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
