const challengeModel = require("../models/challenge.js");
const challengeRequestModel = require("../models/challengeRequest.js");
const messageModel = require("../models/message.js");
const userModel = require("../models/user.js");
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
  checkIfUserIsAuthorized,
  checkIfIDAlreadyExistsWithinArrayField
} = require("./controller.js");

/**
 * Check to see if challenge request alredy exists for user
 * @param {string} challengeID
 * @param {string} userID
 * @param {string} status
 * @returns Promise
 */

const checkIfChallengeRequestAlreadyExists = async (
  challengeID,
  userID,
  status
) => {
  return new Promise((resolve, reject) => {
    challengeRequestModel.findOne(
      { challenge_id: challengeID, recipient: userID, status: status },
      function(error, challengeRequest) {
        if (error) reject({ statusCode: 500, msg: error.message });
        if (challengeRequest) {
          reject({
            statusCode: 422,
            msg: "REQUEST_ALREADY_EXISTS"
          });
        } else resolve();
      }
    );
  });
};

/**
 * Check to see if user is a participant of a challenge, if they are not throw an error object
 * @param {string} challengeID
 * @param {string} userID
 * @returns Promise
 */

const checkIfUserIsParticipantOfChallenge = async (challenge_id, userID) => {
  return new Promise((resolve, reject) => {
    let userIsParticipant = false;
    challengeModel.findOne({ _id: challenge_id }, function(error, challenge) {
      if (error) reject({ statusCode: 500, msg: error.message });

      // Go through each of the challenge participants and determine if the passed in user_id is a participant, and set the flag variable to true
      for (i = 0; i < challenge.participants.length; i++) {
        if (challenge.participants[i] == userID) {
          userIsParticipant = true;
        }
      }
      if (userIsParticipant != true) {
        reject({
          statusCode: 403,
          msg: "USER_MUST_BE_A_PARTICIPANT_IN_CHALLENGE"
        });
      } else resolve();
    });
  });
};

/**
 * Format the message field of challenge to list message fields and pending participants fields
 * @param {Object} challenge
 * @return Challenge object
 */

const formatContentsinChallenge = async challenge => {
  try {
    let messageArray = [];
    let pendingParticipantsArray = [];

    challenge = JSON.parse(JSON.stringify(challenge));

    // Show the content of the messages instead of the reference to the message
    for (let i = 0; i < challenge.messages.length; i++) {
      let message = await getEntityFromDB(messageModel, challenge.messages[i]);

      messageArray[i] = {
        _id: message._id,
        sender: message.sender,
        content: message.content,
        replies: message.replies,
        reply_to: message.reply_to,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
      };
    }

    for (let i = 0; i < challenge.pending_participants.length; i++) {
      let challengeRequest = await getEntityFromDB(
        challengeRequestModel,
        challenge.pending_participants[i]
      );
      pendingParticipantsArray[i] = {
        user: challengeRequest.recipient,
        status: challengeRequest.status
      };
    }
    challenge.pending_participants = pendingParticipantsArray;

    challenge.messages = messageArray;

    return challenge;
  } catch (error) {
    return error;
  }
};

/**
 * Update the activity level of a participant in a challenge
 * @param {string} challengeID
 * @param {string} userID
 * @param {number} total
 * @return Promise
 */

const updateActivityInDB = async (challengeID, userID, total) => {
  try {
    return await challengeModel.findOneAndUpdate(
      {
        _id: challengeID,
        "participants.user_id": userID
      },
      { $inc: { "participants.$.total": total } },
      { new: true }
    );
  } catch (error) {
    return error;
  }
};

/**
 * Create a message in the database
 * @param {string} challengeID
 * @param {Object} data
 * @param {string} userID
 * @return Promise
 */

const createMessageInDB = async (challengeID, data, userID) => {
  try {
    let messageFields = {
      sender: userID,
      content: data.content,
      reply_to: data.reply
    };
    let message = await createEntityInDB(messageModel, messageFields);
    await challengeModel.findOneAndUpdate(
      {
        _id: challengeID
      },
      { $push: { messages: message._id } }
    );

    // if the messge is a reply to another message, add the message id to the replies field of the other message
    if (data.reply) {
      await messageModel.findOneAndUpdate(
        {
          _id: data.reply
        },
        { $push: { replies: message._id } }
      );
    }
  } catch (error) {
    return error;
  }
};

/**
 * Accept a challenge request and update the user, challenge, and challengeRequests collections
 * @param {string} challengeID
 * @param {string} participant
 * @return Promise
 */

const acceptChallengeRequest = async (challengeID, participantID) => {
  try {
    // Make sure user is not already a participant in the challenge
    await checkIfIDAlreadyExistsWithinArrayField(
      challengeModel,
      challengeID,
      "participants",
      participantID
    );

    // Add the challenge ID to the challenge field of the user document
    await userModel.findOneAndUpdate(
      { _id: participantID },
      { $push: { challenges: challengeID } }
    );

    // Get the challenge request document
    const challengeRequest = await challengeRequestModel.findOne({
      recipient: participantID,
      challenge_id: challengeID
    });

    // Add the participant's id to the participants field
    await challengeModel.findOneAndUpdate(
      { _id: challengeRequest.challenge_id },
      { $push: { participants: participantID } }
    );

    removePendingChallenges(challengeID, participantID);
  } catch (error) {
    throw error;
  }
};

/**
 * Remove the pending challenge request and update the user, challenge, and challengeRequests collections
 * @param {string} challengeID
 * @param {string} participant
 * @return Promise
 */

const removePendingChallenges = async (challengeID, participantID) => {
  try {
    // Get the challenge request document
    const challengeRequest = await challengeRequestModel.findOne({
      recipient: participantID,
      challenge_id: challengeID
    });

    // Remove the challenge ID from pending challenges
    await userModel.findOneAndUpdate(
      { _id: participantID },
      { $pull: { pending_challenges: challengeRequest._id } }
    );

    // Remove the challenge request from pending_challenges in challenges
    await challengeModel.findOneAndUpdate(
      { _id: challengeRequest.challenge_id },
      { $pull: { pending_participants: challengeRequest._id } }
    );

    // Remove the challenge request
    await deleteEntityFromDB(challengeRequestModel, challengeRequest._id);
  } catch (error) {
    return error;
  }
};

/**
 * Create the challenge request and update the user, challenge, and challengeRequests collections
 * @param {string} challengeID
 * @param {string} participant
 * @return Promise
 */

const createChallengeRequest = async (challengeID, participantID) => {
  try {
    // Check to make sure there aren't any pending challenges with the participant and challengeID
    await checkIfChallengeRequestAlreadyExists(challengeID, participantID, 1);

    const challengeRequest = await challengeRequestModel.findOneAndUpdate(
      { recipient: participantID },
      { $set: { status: 1, challenge_id: challengeID } },
      { upsert: true, new: true }
    );

    // Update the pending challenges field for user with participant ID
    await userModel.findOneAndUpdate(
      { _id: participantID },
      { $push: { pending_challenges: challengeRequest._id } }
    );

    // Update the pending participants of the challenge document
    await challengeModel.findOneAndUpdate(
      { _id: challengeID },
      { $push: { pending_participants: challengeRequest._id } }
    );
  } catch (error) {
    throw error;
  }
};

/********************** Functions called by Route **************************************************/

exports.createChallenge = async (req, res) => {
  try {
    let validatedFields = matchedData(req, { includeOptionals: false });

    // Add the user who created the challenge as a participant
    let participants = [];
    participants.push(req.user._id);
    validatedFields.participants = participants;

    let challenge = await createEntityInDB(challengeModel, validatedFields);
    let formattedChallenge = await formatContentsinChallenge(challenge);

    res.status(200).json(formattedChallenge);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.addParticipant = async (req, res) => {
  try {
    let challengeID = req.params.challengeID;
    let participantID = req.params.participantID;
    let status = req.body.status;

    /* status codes
	0  - Send challenge request
	1  - Pending challenge request
	2  - Accept challenge request
	3  - Reject challenge request
	*/

    switch (status) {
      case "0":
        await createChallengeRequest(challengeID, participantID);
        break;
      case "2":
        await acceptChallengeRequest(challengeID, participantID);
        break;
      case "3":
        await removePendingChallenges(challengeID, participantID);
        break;
    }

    res.status(200).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.removeParticipant = async (req, res) => {
  try {
    let challengeID = req.params.challengeID;
    let participantID = req.params.participantID;
    let userID = req.user._id;

    await checkIfUserIsParticipantOfChallenge(challengeID, userID);

    // Remove the user's id from the participants field of challenge
    await removeFromFieldArray(
      challengeModel,
      "participants",
      challengeID,
      participantID
    );

    // Remove the challenge id from the user model
    await removeFromFieldArray(userModel, "challenges", userID, challengeID);
    res.status(200).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getChallenge = async (req, res) => {
  let id = req.params.challengeID;
  let pending_participants = [];

  try {
    /* Convert the mongodb document to a javascript object to display information about the challenge request instead of the challenge request object id number
	https://stackoverflow.com/questions/14768132/add-a-new-attribute-to-existing-json-object-in-node-js/29131856
  */
    let challenge = await getEntityFromDB(challengeModel, id);

    let formattedChallenge = await formatContentsinChallenge(challenge);

    res.status(200).json(formattedChallenge);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.createMessage = async (req, res) => {
  let challengeID = req.params.id;
  let userID = req.user._id;

  try {
    // Only allow participant of challenge to send message
    await checkIfUserIsParticipantOfChallenge(challengeID, userID);

    // Check if user is a participant in the challenge
    let validatedFields = matchedData(req, { includeOptionals: false });
    await createMessageInDB(challengeID, validatedFields, userID);
    let challenge = await getEntityFromDB(challengeModel, challengeID);

    let formattedChallenge = await formatContentsinChallenge(challenge);

    res.status(200).json(formattedChallenge);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.updateChallenge = async (req, res) => {
  try {
    let challengeID = req.params.challengeID;
    let userID = req.user._id;
    // Only allow participant of challenge to update the challenge
    await checkIfUserIsParticipantOfChallenge(challengeID, userID);

    // Use the matched data function of validator to return data that was validated thru express-validaotr. Optional data will be included
    let validatedFields = {
      $set: matchedData(req, { includeOptionals: false })
    };

    let updatedChallenge = await updateEntityFromDB(
      challengeModel,
      challengeID,
      validatedFields
    );

    let formattedChallenge = await formatContentsinChallenge(updatedChallenge);
    res.status(200).json(formattedChallenge);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.deleteChallenge = async (req, res) => {
  try {
    let challengeID = req.params.id;
    let userID = req.user._id;

    // Only allow participant of challenge to delete the challenge
    await checkIfUserIsParticipantOfChallenge(challengeID, userID);

    await getEntityFromDB(challengeModel, challengeID);

    await deleteEntityFromDB(challengeModel, challengeID);
    res.status(204).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    let challengeID = req.params.challengeID;
    let messageID = req.params.messageID;
    let userID = req.user._id;

    // Only allow participant of challenge to delete the message
    await checkIfUserIsParticipantOfChallenge(challengeID, userID);

    // Check to make sure user is owner of message
    let message = await getEntityFromDB(messageModel, messageID);

    await checkIfUserIsSenderOfMessage(message._id, userID);

    // Remove the message id from the messages of the challenge field
    await removeFromFieldArray(
      challengeModel,
      "messages",
      challengeID,
      messageID
    );

    // If the message was a reply to any message remove that instance off the parent message
    if (message.reply_to) {
      await removeFromFieldArray(
        messageModel,
        "replies",
        message.reply_to,
        message._id
      );
    }

    await deleteEntityFromDB(messageModel, messageID);

    res.status(204).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.updateMessage = async (req, res) => {
  try {
    let messageID = req.params.messageID;
    let challengeID = req.params.challengeID;
    let userID = req.user._id;
    let validatedFields = {
      $set: matchedData(req, { includeOptionals: false })
    };

    await checkIfUserIsSenderOfMessage(messageID, userID);

    await updateEntityFromDB(messageModel, messageID, validatedFields);
    let challenge = await getEntityFromDB(challengeModel, challengeID);

    let formattedChallenge = await formatContentsinChallenge(challenge);
    res.status(200).json(formattedChallenge);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
