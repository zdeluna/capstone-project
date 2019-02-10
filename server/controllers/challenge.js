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

const updateActivityInDB = async (challengeID, userID, total) => {
  try {
    return await challengeModel.findOneAndUpdate(
      {
        _id: challengeID,
        "participants.user_id": userID
      },
      { $inc: { "participants.$.total": 10 } },
      { new: true }
      // { $set: { participants: updatedParticipants } }
    );
  } catch (error) {
    return error;
  }
};

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
    //await checkIfUserIsAuthorized(req.params.userID, req);

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
  let challengeID = new ObjectId(req.params.id);
  let userID = new ObjectId(req.user._id);

  try {
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
    // Use the matched data function of validator to return data that was validated thru express-validaotr. Optional data will be included
    let validatedFields = {
      $set: matchedData(req, { includeOptionals: false })
    };

    console.log(2);
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
