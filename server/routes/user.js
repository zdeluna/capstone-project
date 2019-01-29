const express = require("express");
const router = express.Router();
const passport = require("passport");

const authenticateUser = passport.authenticate("jwt", { session: false });
const controller = require("../controllers/user");

router.get("/:id", controller.getEntity);

router.delete("/:id", authenticateUser, controller.deleteEntity);

module.exports = router;
