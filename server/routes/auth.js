let express = require("express");
const userModel = require("../models/user.js");

let router = express.Router();
let passport = require("passport");
let controller = require("../controllers/auth.js");
let jwt = require("jsonwebtoken");
require("dotenv").config();
let validator = require("../controllers/auth.validation");
const url = require("url");

router.post("/signup", validator.signup, controller.signup);

router.post("/login", controller.login);

module.exports = router;
