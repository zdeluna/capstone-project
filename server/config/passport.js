// Consulted https://scotch.io/@devGson/api-authentication-with-json-web-tokensjwt-and-passport
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local#toc-handling-signupregistration
let passport = require('passport');
let localStrategy = require('passport-local').Strategy;
let User = require('../models/user');
let JWTstrategy = require('passport-jwt').Strategy;
let ExtractJWT = require('passport-jwt').ExtractJwt;
let googleStrategy = require('passport-google-oauth20').Strategy;
let bcrypt = require('bcrypt');

require('dotenv').config();

passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async function(email, password, done) {
            try {
                User.findOne({email: email}, async function(err, user) {
                    // Return any errors
                    if (err) return done(err);

                    // If a user doesn't exist, create one in the database
                    if (!user) {
                        // Hash the password, so that it is not easily read from the database
                        const hash = await bcrypt.hash(password, 10);

                        var user = new User({email: email, password: hash});
                        user.save(function(err) {
                            return done(err, user);
                        });
                    }

                    // Otherwise, the uer already exists in the database
                    else {
                        done(null, null, {
                            message: 'User has already been created',
                        });
                    }
                });
            } catch (error) {
                done(error);
            }
        },
    ),
);

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({email});
                if (!user) {
                    return done(null, false, {message: 'User is not found'});
                }

                const isPasswordCorrect = await user.isCorrectPassword(
                    password,
                );

                if (!isPasswordCorrect) {
                    return done(null, false, {message: 'Wrong Password'});
                }

                // Send the user to the next next middleware
                return done(null, user, {message: 'Logged in'});
            } catch (error) {
                return done(error);
            }
        },
    ),
);

// Make sure token is valid when user is trying to make requests
// to the API
passport.use(
    new JWTstrategy(
        {
            // Extract the jwt token located in the authorization header
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        },
    ),
);

passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5001/auth/google/callback',
            scope: 'https://www.googleapis.com/auth/plus.login',
        },
        function(accessToken, refreshToken, profile, callBack) {
            User.findOne({providerId: profile.id}, function(err, user) {
                if (err) return callBack(err);
                if (!user)
                    user = new User({
                        email: profile.emails[0].value,
                        accessToken: accessToken,
                        provider: 'google',
                        providerId: profile.id,
                    });

                user.save(function(err) {
                    return callBack(err, user);
                });
            });
        },
    ),
);
