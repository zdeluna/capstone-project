const express = require("express");
const router = express.Router();
const passport = require("passport");
const validator = require("../controllers/activity.validation");

const authenticateUser = passport.authenticate("jwt", { session: false });
const controller = require("../controllers/activity");

router.post(
  "/",
  authenticateUser,
  validator.createActivity,
  controller.createActivity
);

router.patch(
  "/:id",
  authenticateUser,
  validator.updateActivity,
  controller.updateActivity
);

module.exports = router;
