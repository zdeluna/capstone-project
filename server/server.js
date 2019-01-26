const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
require('dotenv').config();

const user = require('./routes/user');
const auth = require('./routes/auth');

const User = require('./models/user');
const startMongo = require('./config/mongo');
const app = express();

var GoogleStrategy = require('passport-google-oauth20').Strategy;

let port = 5001;
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

startMongo();

require('./config/passport');
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());

passport.serializeUser(function(user, callBack) {
    callBack(null, user);
});

passport.deserializeUser(function(obj, callBack) {
    callBack(null, obj);
});

app.use('/auth', auth);
app.use('/users', user);
app.use('/', auth);
app.use('/', auth);
