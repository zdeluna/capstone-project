const express = require('express');
const router = express.Router();
const passport = require('passport');

const authenticateUser = passport.authenticate('google');

const controller = require('../controllers/user');

router.get(
    '/:id',
    passport.authenticate('jwt', {session: false}),
    controller.getEntity,
);

module.exports = router;
