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

/**
 * Format the message field of conversation to list sender and message contents
 * @param {Object} conversation
 * @return Conversation object
 */

const formatMessageContentsinConversation = async conversation => {
  try {
    let messageArray = [];

    conversation = JSON.parse(JSON.stringify(conversation));

    // Show the content of the messages instead of the reference to the message
    for (let i = 0; i < conversation.messages.length; i++) {
      let message = await getEntityFromDB(
        messageModel,
        conversation.messages[i]
      );

      messageArray[i] = { sender: message.sender, content: message.content };
    }

    conversation.messages = messageArray;

    return conversation;
  } catch (error) {
    return error;
  }
};

/**
 * Create a new conversation and add the message contents to the conversation
 * @param {string} userID
 * @param {Object} data <- contains validated fields
 * @return Conversation object
 */

const createConversationInDB = async (userID, data) => {
  try {
    let recipientID = data.recipient;
    let messageFields = { sender: userID, content: data.content };

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

    return conversation;
  } catch (error) {
    return error;
  }
};

exports.createConversation = async (req, res) => {
  try {
    let userID = req.user._id;
    let validatedFields = matchedData(req, { includeOptionals: false });
    let conversation = await createConversationInDB(userID, validatedFields);
    let formattedConversation = await formatMessageContentsinConversation(
      conversation
    );

    res.status(200).send(formattedConversation);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getConversation = async (req, res) => {
  try {
    let conversationID = req.params.conversationID;
    let conversation = await getEntityFromDB(conversationModel, conversationID);
    let messageArray = [];

    let formattedConversation = await formatMessageContentsinConversation(
      conversation
    );

    res.status(200).json(formattedConversation);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
