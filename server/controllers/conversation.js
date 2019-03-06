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
  removeFromFieldArray,
  sendErrorResponse,
  checkIfUserIsSenderOfMessage,
  checkIfUserIsAuthorized
} = require("./controller.js");

/**
 * Check to see if user is a participant of a conversation, if they are not throw an error object
 * @param {string} challengeID
 * @param {string} user_id
 * @returns Promise
 */

const checkIfUserIsParticipantOfConversation = async (
  conversation_id,
  user_id
) => {
  return new Promise((resolve, reject) => {
    let userIsParticipant = false;
    conversationModel.findOne({ _id: conversation_id }, function(
      error,
      conversation
    ) {
      if (error) reject({ statusCode: 500, msg: error.message });

      // Go through each of the conversation participants and determine if the passed in user_id is a participant, and set the flag variable to true
      for (i = 0; i < conversation.participants.length; i++) {
        if (conversation.participants[i] == user_id) {
          userIsParticipant = true;
          break;
        }
      }
      if (userIsParticipant != true) {
        reject({
          statusCode: 403,
          msg: "USER_MUST_BE_A_PARTICIPANT_IN_CONVERSATION"
        });
      } else resolve();
    });
  });
};

/**
 * Create a new message by creating a new message collection and adding the message id to the messages array in coversation
 * @param {Object} messageFields
 * @param {string} conversationID
 * @return Conversation object
 */

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

/**
 * Add participants to a conversation by updating conversation model and including participant's id and updating user model to include
 * conversation id in coversation field
 * @param {Array} participants
 * @param {string} conversationID
 * @return Conversation object
 */

const addParticipantsToConversation = async (participants, conversationID) => {
  try {
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

      messageArray[i] = {
        _id: message._id,
        sender: message.sender,
        content: message.content,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
      };
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
    let userID = req.user._id;
    let conversationID = req.params.conversationID;

    await checkIfUserIsParticipantOfConversation(conversationID, userID);

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
    let conversationID = req.params.conversationID;
    let userID = req.user._id;

    await checkIfUserIsParticipantOfConversation(conversationID, userID);

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

exports.deleteMessage = async (req, res) => {
  try {
    let messageID = req.params.messageID;
    let conversationID = req.params.conversationID;
    let userID = req.user._id;

    await checkIfUserIsSenderOfMessage(messageID, userID);
    await getEntityFromDB(messageModel, messageID);
    await getEntityFromDB(conversationModel, conversationID);

    // Delete the reference in the conversations model
    let conversation = await removeFromFieldArray(
      conversationModel,
      "messages",
      conversationID,
      messageID
    );

    await deleteEntityFromDB(messageModel, messageID);

    res.status(204).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.updateMessage = async (req, res) => {
  try {
    let messageID = req.params.messageID;
    let conversationID = req.params.conversationID;
    let userID = req.user._id;
    let validatedFields = {
      $set: matchedData(req, { includeOptionals: false })
    };

    await checkIfUserIsSenderOfMessage(messageID, userID);

    await updateEntityFromDB(messageModel, messageID, validatedFields);
    let conversation = await getEntityFromDB(conversationModel, conversationID);
    let formattedConversation = await formatMessageContentsinConversation(
      conversation
    );

    res.status(200).json(formattedConversation);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.leaveConversation = async (req, res) => {
  try {
    let conversationID = req.params.conversationID;
    let userID = req.user._id;

    await checkIfUserIsParticipantOfConversation(conversationID, userID);

    // Remove the user id from participants in conversation
    await removeFromFieldArray(
      conversationModel,
      "participants",
      conversationID,
      userID
    );

    // Remove the conversation id from the user's model
    await removeFromFieldArray(
      userModel,
      "conversations",
      userID,
      conversationID
    );

    res.status(200).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
