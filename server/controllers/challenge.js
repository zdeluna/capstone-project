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

const acceptChallengeRequest = async (challengeID, participantID) => {};

const rejectChallengeRequest = async (challengeID, participantID) => {};

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

    let challenge = await createEntityInDB(challengeModel, validatedFields);
    res.status(200).json(challenge);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.updateParticipants = async (req, res) => {
  try {
    //await checkIfUserIsAuthorized(req.params.userID, req);

    let challengeID = new ObjectId(req.params.challengeID);
    let participantID = new ObjectId(req.params.participantID);
    let status = req.body.status;

    /* status codes
	0  - Send challenge request
	1  - Accept challenge request
	2  - Reject challenge request
	*/

    switch (status) {
      case "0":
        await createChallengeRequest(challengeID, participantID);
        break;
      case "1":
        await acceptChallengeRequest(challengeID, participantID);
        break;
      case "2":
        await rejectChallengeRequest(challengeID, participantID);
        break;
    }

    res.status(200).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getChallenge = async (req, res) => {
  let id = req.params.challengeID;
  console.log("get challenge with id : " + id);
  try {
    var entity = await getEntityFromDB(challengeModel, id);
    res.status(200).json(entity);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
