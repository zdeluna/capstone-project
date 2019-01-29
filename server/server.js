const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
require("dotenv").config();

const user = require("./routes/user");
const auth = require("./routes/auth");

const User = require("./models/user");
const startMongo = require("./config/mongo");
const app = express();

var GoogleStrategy = require("passport-google-oauth20").Strategy;

const PORT = process.env.PORT || 5000;
app.enable("trust proxy");

startMongo();

require("./config/passport");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

passport.serializeUser(function(user, callBack) {
  callBack(null, user);
});

passport.deserializeUser(function(obj, callBack) {
  callBack(null, obj);
});

app.use("/api/auth", auth);
app.use("/api/users", user);
app.use("/api", auth);

app.use(function(err, req, res, next) {
  res.status(404);
  next(err);
});

app.use(function(err, req, res, next) {
  res.type("plain/text");
  res.status(500);
  console.log(err);
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
