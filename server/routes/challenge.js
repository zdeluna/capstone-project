const express = require("express");
const router = express.Router();
const passport = require("passport");
const validator = require("../controllers/challenge.validation");

const authenticateUser = passport.authenticate("jwt", { session: false });
const controller = require("../controllers/challenge");

router.patch(
  "/:challengeID/participants/:participantID",
  authenticateUser,
  controller.updateParticipants
);

router.post(
  "/:id/messages",
  authenticateUser,
  validator.createMessage,
  controller.createMessage
);

router.get("/:challengeID", controller.getChallenge);

router.post("/", validator.createChallenge, controller.createChallenge);

module.exports = router;
