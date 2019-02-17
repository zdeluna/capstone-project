const challengeModel = require("../models/challenge.js");
const challengeRequestModel = require("../models/challengeRequest.js");
const userModel = require("../models/user.js");
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
 * Check to see if user is a participant of a challenge, if they are not throw an error object
 * @param {string} challengeID
 * @param {string} user_id
 * @returns Promise
 */

const checkIfUserIsParticipantOfChallenge = async (challenge_id, user_id) => {
  return new Promise((resolve, reject) => {
    let userIsParticipant = false;
    challengeModel.findOne({ _id: challenge_id }, function(error, challenge) {
      if (error) reject({ statusCode: 500, msg: error.message });

      // Go through each of the challenge participants and determine if the passed in user_id is a participant, and set the flag variable to true
      for (i = 0; i < challenge.participants.length; i++) {
        if (challenge.participants[i].user_id == user_id) {
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
      { $inc: { "participants.$.total": 10 } },
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
    await challengeModel.findOneAndUpdate(
      {
        _id: challengeID
      },
      { $push: { messages: { content: data.content, sender: userID } } }
    );
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
      { $push: { participants: { user_id: participantID, total: 0 } } }
    );

    removePendingChallenges(challengeID, participantID);
  } catch (error) {
    return error;
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
    return error;
  }
};

/********************** Functions called by Route **************************************************/

exports.createChallenge = async (req, res) => {
  try {
    let validatedFields = matchedData(req, { includeOptionals: false });

    // Add the user who created the challenge as a participant
    let participants = [];
    participants.push({ user_id: new ObjectId(req.user._id), total: 0 });
    validatedFields.participants = participants;

    let challenge = await createEntityInDB(challengeModel, validatedFields);
    res.status(200).json(challenge);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.addParticipant = async (req, res) => {
  try {
    let challengeID = new ObjectId(req.params.challengeID);
    let participantID = new ObjectId(req.params.participantID);
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

exports.getChallenge = async (req, res) => {
  let id = req.params.challengeID;
  let pending_participants = [];

  try {
    /* Convert the mongodb document to a javascript object to display information about the challenge request instead of the challenge request object id number
	https://stackoverflow.com/questions/14768132/add-a-new-attribute-to-existing-json-object-in-node-js/29131856
  */
    var challenge = JSON.parse(
      JSON.stringify(await getEntityFromDB(challengeModel, id))
    );

    for (let i = 0; i < challenge.pending_participants.length; i++) {
      let challengeRequest = await getEntityFromDB(
        challengeRequestModel,
        challenge.pending_participants[i]
      );
      pending_participants[i] = {
        user: challengeRequest.recipient,
        status: challengeRequest.status
      };
    }
    challenge.pending_participants = pending_participants;

    res.status(200).json(challenge);
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
    createMessageInDB(challengeID, validatedFields, userID);
    res.status(200).end();
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
    res.status(200).json(updatedChallenge);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.updateActivity = async (req, res) => {
  try {
    let challengeID = req.params.challengeID;
    let participantID = req.params.participantID;

    await checkIfUserIsAuthorized(participantID, req);

    // Use the matched data function of validator to return data that was validated thru express-validaotr. Optional data will be included
    let validatedFields = {
      $set: matchedData(req, { includeOptionals: false })
    };

    let updatedChallenge = await updateActivityInDB(
      challengeID,
      participantID,
      10
    );
    res.status(200).json(updatedChallenge);
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
