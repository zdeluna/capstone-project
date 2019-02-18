const express = require("express");
const router = express.Router();
const passport = require("passport");
const validator = require("../controllers/challenge.validation");

const authenticateUser = passport.authenticate("jwt", { session: false });
const controller = require("../controllers/conversation.js");

router.post("/", authenticateUser, controller.createConversation);

module.exports = router;
