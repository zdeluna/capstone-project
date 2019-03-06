const activityModel = require("../models/activity.js");
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

exports.createActivity = async (req, res) => {
  try {
    let userID = req.user._id;

    let validatedFields = matchedData(req, { includeOptionals: false });
    validatedFields.user_id = userID;

    let activity = await createEntityInDB(activityModel, validatedFields);
    res.status(200).json(activity);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.updateActivity = async (req, res) => {
  try {
    let activityID = req.params.id;
    let userID = req.user._id;

    // Use the matched data function of validator to return data that was validated thru express-validaotr. Optional data will be included
    let validatedFields = {
      $set: matchedData(req, { includeOptionals: false })
    };

    // Check to make sure user is only updating their own activity
    let activity = await getEntityFromDB(activityModel, activityID);
    await checkIfUserIsAuthorized(activity.user_id, req);

    let updatedActivity = await updateEntityFromDB(
      activityModel,
      activityID,
      validatedFields
    );
    res.status(200).json(updatedActivity);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    let activityID = req.params.id;
    let userID = req.user._id;

    // Check to make sure user is only deleting their own activity
    let activity = await getEntityFromDB(activityModel, activityID);
    await checkIfUserIsAuthorized(activity.user_id, req);

    await deleteEntityFromDB(activityModel, activityID);
    res.status(204).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getActivities = async (req, res) => {
  try {
    let query = {};

    if (req.query.user_id) query.user_id = req.query.user_id;
    if (req.query.type) query.type = req.query.type;

    // Consulted https://stackoverflow.com/questions/2943222/find-objects-between-two-dates-mongodb
    if (req.query.start_date && req.query.end_date) {
      let start_date = new Date(req.query.start_date).toISOString();
      let end_date = new Date(req.query.end_date).toISOString();

      query.date = {
        $gte: start_date,
        $lte: end_date
      };
    }
    let activities = await getAllEntitiesFromDB(activityModel, query);
    res.status(200).send(activities);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getActivity = async (req, res) => {
  try {
    let activityID = req.params.id;
    let activity = await getEntityFromDB(activityModel, activityID);
    res.status(200).send(activity);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
