// Consulted https://scotch.io/@devGson/api-authentication-with-json-web-tokensjwt-and-passport

let passport = require("passport");
let localStrategy = require("passport-local").Strategy;
let User = require("../models/user");
let JWTstrategy = require("passport-jwt").Strategy;
let ExtractJWT = require("passport-jwt").ExtractJwt;
let jwt = require("jsonwebtoken");

exports.googleLogin = async (req, res) => {
  console.log("in google login function");
  passport.authenticate("google", {
    scope: ["email profile"]
  });
};

exports.signup = async (req, res, next) => {
  passport.authenticate(
    "signup",
    { session: false },
    async (error, user, statusMessage) => {
      if (!user) return res.status(422).json(statusMessage);
      else {
        res.status(200).json({
          msg: "Signup was sucessful",
          user: user
        });
      }
    }
  )(req, res, next);
};

exports.login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, statusMessage) => {
    // Establish a login session and user will be assigned to req.user
    req.login(user, { session: false }, async error => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return res.status(422).json(statusMessage);
      }
      const body = { _id: user._id };
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
      return res.status(200).json({ token: token, user_id: user._id });
    });
  })(req, res, next);
};
