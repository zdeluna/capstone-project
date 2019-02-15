const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const user = require("./routes/user");
const auth = require("./routes/auth");
const challenge = require("./routes/challenge");

const User = require("./models/user");
const startMongo = require("./config/mongo");
const app = express();

const PORT = process.env.PORT || 5000;
app.enable("trust proxy");

startMongo();

require("./config/passport");

// App can parse x-www urlencoded form data when making POST requests
app.use(bodyParser.urlencoded({ extended: false }));
// App can parse json in http requests
app.use(bodyParser.json());

app.use(cors());

app.use(passport.initialize());

passport.serializeUser(function(user, callBack) {
  callBack(null, user);
});

passport.deserializeUser(function(obj, callBack) {
  callBack(null, obj);
});

app.use("/api/auth", auth);
app.use("/api/users", user);
app.use("/api/challenges", challenge);
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
