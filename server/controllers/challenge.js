const challengeModel = require("../models/challenge.js");
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

exports.createChallenge = async (req, res) => {
  try {
    let validatedFields = {
      $set: matchedData(req, { includeOptionals: false })
    };

    let challenge = await createEntityInDB(challengeModel, validatedFields);
    res.status(200).json(challenge);
  } catch (error) {
    console.log("error in function " + error);
    sendErrorResponse(res, error);
  }
};
