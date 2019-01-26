// Consulted https://scotch.io/@devGson/api-authentication-with-json-web-tokensjwt-and-passport

let passport = require('passport');
let localStrategy = require('passport-local').Strategy;
let User = require('../models/user');
let JWTstrategy = require('passport-jwt').Strategy;
let ExtractJWT = require('passport-jwt').ExtractJwt;

exports.googleLogin = async (req, res) => {
    console.log('in function');
    passport.authenticate('google', {
        scope: ['email profile'],
    });
};
