const express = require("express");
const router = express.Router();
const passport = require("passport");
const validator = require("../controllers/user.validation");

const authenticateUser = passport.authenticate("jwt", { session: false });
const controller = require("../controllers/user");

router.get("/:id", controller.getUser);

router.patch(
  "/:userID/friends/:friendID",
  authenticateUser,
  controller.updateFriendship
);

router.patch(
  "/:id",
  authenticateUser,
  validator.update,
  controller.updateEntity
);

router.delete("/:id", authenticateUser, controller.deleteEntity);

module.exports = router;
