const express = require("express");
const mex = require("mustache-express");
const bodyparser = require("body-parser");
const app = express();
const expressValidator = require("express-validator");
const path = require("path");
const routes = require('./routes/routes');
const session = require("express-session");

app.engine("mustache", mex());

app.set("port", (process.env.PORT || 3000));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

// serve static files to server
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(expressValidator());
// initialize Express sessions
app.use(session({
  secret:"nskl",
  resave: false,
  saveUninitialized:false
}));

// endpoint
app.get("/", function (req , res) {
  // render index.mustache file
  res.render("index");
});

app.use(routes);

app.listen(app.get("port"), function () {
  console.log("whats up mane");
});
