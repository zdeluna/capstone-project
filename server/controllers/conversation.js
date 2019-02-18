const userModel = require("../models/challenge.js");
const conversationModel = require("../models/conversation.js");
const messageModel = require("../models/message.js");
var ObjectId = require("mongodb").ObjectId;
const { matchedData } = require("express-validator/filter");
const {
  getEntityFromDB,
  getAllEntitiesFromDB,
  createEntityInDB,
  deleteEntityFromDB,
  updateEntityFromDB,
  sendErrorResponse,
  checkIfUserIsAuthorized
} = require("./controller.js");

exports.createConversation = async (req, res) => {
  let userID = req.user._id;
  let recipientID = req.body.recipient;
  let message_body = req.body.content;

  let testObject = { recipientID: recipientID, content: message_body };

  try {
    // Check if user is a participant in the challenge
    // let validatedFields = matchedData(req, { includeOptionals: false });
    //createConversationInDB(challengeID, validatedFields, userID)
    res.status(200).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
