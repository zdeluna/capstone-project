const express = require("express");
const router = express.Router();
const passport = require("passport");
const validator = require("../controllers/conversation.validation");

const authenticateUser = passport.authenticate("jwt", { session: false });
const controller = require("../controllers/conversation.js");

router.delete(
  "/:conversationID/messages/:messageID",
  authenticateUser,
  controller.deleteMessage
);

router.patch(
  "/:conversationID/messages/:messageID",
  authenticateUser,
  validator.updateMessage,
  controller.updateMessage
);

router.delete(
  "/:conversationID/participants",
  authenticateUser,
  controller.leaveConversation
);

router.get("/:conversationID", authenticateUser, controller.getConversation);

router.patch(
  "/:conversationID",
  authenticateUser,
  validator.updateConversation,
  controller.updateConversation
);

router.post(
  "/",
  authenticateUser,
  validator.createConversation,
  controller.createConversation
);

module.exports = router;
