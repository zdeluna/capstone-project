const userModel = require("../models/user.js");
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

const createConversationInDB = async () => {};

exports.createConversation = async (req, res) => {
  try {
    let userID = req.user._id;

    let validatedFields = matchedData(req, { includeOptionals: false });
    //createConversationInDB(challengeID, validatedFields, userID);
    let recipientID = validatedFields.recipient;
    let messageFields = { sender: userID, content: validatedFields.content };

    // Add the message to the message collection
    let message = await createEntityInDB(messageModel, messageFields);
    // Add the message to the conversation
    let conversationFields = {
      messages: message._id,
      participants: userID
    };

    let conversation = await createEntityInDB(
      conversationModel,
      conversationFields
    );

    await conversationModel.findOneAndUpdate(
      { _id: conversation._id },
      { $push: { participants: recipientID } }
    );

    // Update each user's collection
    await userModel.findOneAndUpdate(
      { _id: userID },
      { $push: { conversations: conversation._id } }
    );

    // Update each user's collection
    await userModel.findOneAndUpdate(
      { _id: recipientID },
      { $push: { conversations: conversation._id } }
    );

    res.status(200).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
