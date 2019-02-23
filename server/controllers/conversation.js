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

const createNewMessage = async (messageFields, conversationID) => {
  try {
    let message = await createEntityInDB(messageModel, messageFields);
    let conversation = await conversationModel.findOneAndUpdate(
      { _id: conversationID },
      { $push: { messages: message._id } },
      { new: true }
    );
    return conversation;
  } catch (error) {
    return error;
  }
};

const addParticipantsToConversation = async (participants, conversationID) => {
  try {
    //let conversation;
    for (i = 0; i < participants.length; i++) {
      let participantID = participants[i];

      // Update each conversation collection to include each participant
      conversation = await conversationModel.findOneAndUpdate(
        { _id: conversationID },
        { $push: { participants: participantID } },
        { new: true }
      );

      // Update each user's collection
      await userModel.findOneAndUpdate(
        { _id: participantID },
        { $push: { conversations: conversationID } }
      );

      return conversation;
    }
  } catch (error) {
    return error;
  }
};

const updateConversationInDB = async (conversationID, validatedFields) => {
  try {
    let conversation;
    // If there is a new message, create a new message collection
    if (validatedFields.content) {
      let messageFields = {
        sender: validatedFields.sender,
        content: validatedFields.content
      };
      conversation = await createNewMessage(messageFields, conversationID);
    }

    // If there are new recipients, add them to the conversation and update user models
    if (validatedFields.recipient) {
      console.log("Add participants");
      conversation = await addParticipantsToConversation(
        validatedFields.recipient,
        conversationID
      );
    }
    return conversation;
  } catch (error) {
    return error;
  }
};

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
    /*
    conversation = await addParticipantsToConversation(
      recipientID,
      conversation._id
	);*/

    for (i = 0; i < recipientID.length; i++) {
      let objectID = recipientID[i];

      // Update each conversation collection to include each participant
      conversation = await conversationModel.findOneAndUpdate(
        { _id: conversation._id },
        { $push: { participants: objectID } },
        { new: true }
      );

      // Update each user's collection
      await userModel.findOneAndUpdate(
        { _id: recipientID[i] },
        { $push: { conversations: conversation._id } }
      );
    }

    // Update the sender's user collection
    await userModel.findOneAndUpdate(
      { _id: userID },
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
    console.log("in create: " + validatedFields.recipient);
    let conversation = await createConversationInDB(userID, validatedFields);
    let formattedConversation = await formatMessageContentsinConversation(
      conversation
    );

    res.status(200).json(formattedConversation);
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

exports.updateConversation = async (req, res) => {
  try {
    console.log("in update");
    let conversationID = req.params.conversationID;
    let userID = req.user._id;
    // Only allow participant of challenge to update the challenge
    //await checkIfUserIsParticipantOfChallenge(challengeID, userID);

    // Use the matched data function of validator to return data that was validated thru express-validator. Optional data will be included
    let validatedFields = {
      $set: matchedData(req, { includeOptionals: false })
    };

    validatedFields.sender = userID;
    validatedFields.content = req.body.content;
    validatedFields.recipient = req.body.recipient;

    let updatedConversation = await updateConversationInDB(
      conversationID,
      validatedFields
    );
    let formattedConversation = await formatMessageContentsinConversation(
      updatedConversation
    );

    res.status(200).json(formattedConversation);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
