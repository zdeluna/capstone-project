const express = require("express");
const router = express.Router();
const passport = require("passport");
const validator = require("../controllers/record.validation");

const authenticateUser = passport.authenticate("jwt", { session: false });
const controller = require("../controllers/record");

router.post(
  "/",
  authenticateUser,
  validator.createRecord,
  controller.createRecord
);
/*
router.patch(
  "/:id",
  authenticateUser,
  validator.updateActivity,
  controller.updateActivity
);
*/
router.delete("/:id", authenticateUser, controller.deleteRecord);

module.exports = router;
