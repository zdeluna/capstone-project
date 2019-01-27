let express = require("express");
let router = express.Router();
let passport = require("passport");
let controller = require("../controllers/auth.js");
let jwt = require("jsonwebtoken");
require("dotenv").config();
let validator = require("../controllers/auth.validation");

router.get("/login/google", controller.googleLogin);

router.get("/google/callback", passport.authenticate("google"), function(
  req,
  res
) {
  res.status(200).json({ token: req.user.accessToken });
});

router.post("/signup", validator.signup, controller.signup);

router.post("/login", controller.login);

module.exports = router;
