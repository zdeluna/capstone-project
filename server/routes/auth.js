let express = require('express');
let router = express.Router();
let passport = require('passport');
let controller = require('../controllers/auth.js');
let jwt = require('jsonwebtoken');
require('dotenv').config();

router.get(
    '/login/google',
    passport.authenticate('google', {
        scope: ['email profile'],
    }),
);

router.get('/google/callback', passport.authenticate('google'), function(
    req,
    res,
) {
    res.status(200).json({token: req.user.accessToken});
});

router.post('/signup', async (req, res, next) => {
    passport.authenticate(
        'signup',
        {session: false},
        async (error, user, info) => {
            if (!user) return res.status(401).json(info);
            else {
                res.json({
                    message: 'Signup was sucessful',
                    user: user,
                });
            }
        },
    )(req, res, next);
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        // Establish a login session and user will be assigned to req.user
        req.login(user, {session: false}, async error => {
            if (error) {
                return next(error);
            }

            if (!user) {
                return res.status(401).json(info);
            }
            const body = {_id: user._id};
            const token = jwt.sign({user: body}, process.env.JWT_SECRET);
            return res.status(200).json({token});
        });
    })(req, res, next);
});

module.exports = router;
