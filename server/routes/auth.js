let express = require("express");
const userModel = require("../models/user.js");

let router = express.Router();
let passport = require("passport");
let controller = require("../controllers/auth.js");
let jwt = require("jsonwebtoken");
require("dotenv").config();
let validator = require("../controllers/auth.validation");

router.get("/login/google", passport.authenticate("google"));

router.get("/google/callback/", passport.authenticate("google"), function(
  req,
  res
) {
  const body = { _id: req.user._id };
  console.log(body);
  const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
  return res.status(200).json({ token: token, user_id: req.user._id });
});

router.post("/signup", validator.signup, controller.signup);

router.post("/login", controller.login);

module.exports = router;
