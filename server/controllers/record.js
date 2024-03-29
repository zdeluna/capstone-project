const recordModel = require("../models/record.js");
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
  checkIfUserIsAuthorized,
  removeFromFieldArray
} = require("./controller.js");

exports.createRecord = async (req, res) => {
  try {
    let userID = req.user._id;

    let validatedFields = matchedData(req, { includeOptionals: false });
    validatedFields.user_id = userID;

    let record = await createEntityInDB(recordModel, validatedFields);

    // Update the user model to include the new record
    await userModel.findOneAndUpdate(
      { _id: userID },
      { $push: { records: record._id } }
    );

    res.status(200).json(record);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    let recordID = req.params.id;
    let userID = req.user._id;

    // Check to make sure user is only deleting their own activity
    let record = await getEntityFromDB(recordModel, recordID);
    await checkIfUserIsAuthorized(record.user_id, req);

    await deleteEntityFromDB(recordModel, recordID);

    // Delete from user model
    await removeFromFieldArray(userModel, "records", userID, recordID);

    res.status(204).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getRecord = async (req, res) => {
  try {
    let recordID = req.params.id;
    let record = await getEntityFromDB(recordModel, recordID);
    res.status(200).send(record);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.updateRecord = async (req, res) => {
  try {
    let recordID = req.params.id;
    let userID = req.user._id;

    // Use the matched data function of validator to return data that was validated thru express-validaotr. Optional data will be included
    let validatedFields = {
      $set: matchedData(req, { includeOptionals: false })
    };

    // Check to make sure user is only updating their own record
    let record = await getEntityFromDB(recordModel, recordID);
    await checkIfUserIsAuthorized(record.user_id, req);

    let updatedRecord = await updateEntityFromDB(
      recordModel,
      recordID,
      validatedFields
    );
    res.status(200).json(updatedRecord);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
