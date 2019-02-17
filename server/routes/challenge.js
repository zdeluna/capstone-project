const express = require("express");
const router = express.Router();
const passport = require("passport");
const validator = require("../controllers/challenge.validation");

const authenticateUser = passport.authenticate("jwt", { session: false });
const controller = require("../controllers/challenge");

router.post(
  "/:challengeID/participants/:participantID",
  authenticateUser,
  controller.addParticipant
);

router.patch(
  "/:challengeID/participants/:participantID",
  authenticateUser,
  validator.updateActivity,
  controller.updateActivity
);

router.post(
  "/:id/messages",
  authenticateUser,
  validator.createMessage,
  controller.createMessage
);

router.get("/:challengeID", controller.getChallenge);

router.patch(
  "/:challengeID",
  authenticateUser,
  validator.updateChallenge,
  controller.updateChallenge
);

router.delete("/:id", authenticateUser, controller.deleteChallenge);

router.post(
  "/",
  authenticateUser,
  validator.createChallenge,
  controller.createChallenge
);

module.exports = router;
