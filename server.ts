import 'zone.js/dist/zone-node';
import {enableProdMode} from '@angular/core';
import {ngExpressEngine} from '@nguniversal/express-engine';
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import {join} from 'path';

//API constants
const passport = require("passport");
const bodyParser = require("body-parser");
require("dotenv").config();

const user = require("./routes/user");
const auth = require("./routes/auth");
const challenge = require("./routes/challenge");

const User = require("./models/user");
const startMongo = require("./config/mongo");

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

//API setup
startMongo();
require("./config/passport");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

passport.serializeUser(function(user, callBack) {
  callBack(null, user);
});

passport.deserializeUser(function(obj, callBack) {
  callBack(null, obj);
});

//API calls
app.use("/api/auth", auth);
app.use("/api/users", user);
app.use("/api/challenges", challenge);
app.use("/api", auth);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
