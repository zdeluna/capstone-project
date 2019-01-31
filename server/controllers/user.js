const model = require("../models/user.js");
var ObjectId = require("mongodb").ObjectId;
const { matchedData } = require("express-validator/filter");

const getEntityFromDB = async id => {
  var objectId = new ObjectId(id);
  return new Promise((resolve, reject) => {
    model.findById(objectId, (error, entity) => {
      if (error) {
        reject({ statusCode: 422, msg: error.message });
      }

      if (!entity) {
        reject({ statusCode: 404, msg: "USER_DOES_NOT_EXIST" });
      }
      resolve(entity);
    });
  });
};

const deleteEntityFromDB = async id => {
  var objectId = new ObjectId(id);
  return new Promise((resolve, reject) => {
    model.deleteOne({ _id: objectId }, function(error) {
      if (error) reject({ statusCode: 422, msg: error.message });
      else resolve();
    });
  });
};

const updateEntityFromDB = async (id, data) => {
  var objectId = new ObjectId(id);
  return new Promise((resolve, reject) => {
    model.findByIdAndUpdate(objectId, data, (error, entity) => {
      console.log(error);
      if (error) reject({ statusCode: 422, msg: error.message });
      if (!entity) reject({ statusCode: 404, msg: "USER_DOES_NOT_EXIST" });

      resolve(entity);
    });
  });
};

const sendErrorResponse = async (res, error) => {
  res.status(error.statusCode).json({ errors: { msg: error.msg } });
};

const checkIfUserIsAuthorized = async req => {
  return new Promise((resolve, reject) => {
    if (req.params.id !== req.user._id) {
      reject({ statusCode: 401, msg: "USER_IS_NOT_AUTHORIZED" });
    }
    resolve();
  });
};

/* Public Functions that are directly called by the routers */
exports.getEntity = async (req, res) => {
  let id = req.params.id;
  try {
    var entity = await getEntityFromDB(id);
    res.status(200).json(entity);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.deleteEntity = async (req, res) => {
  let id = req.params.id;

  try {
    await checkIfUserIsAuthorized(req);
    await getEntityFromDB(id);

    await deleteEntityFromDB(id);
    res.status(204).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.updateEntity = async (req, res) => {
  let id = req.params.id;

  try {
    await checkIfUserIsAuthorized(req);

    // Use the matched data function of validator to return data that was validated thru express-validaotr. Optional data will be included
    console.log(matchedData(req, { includeOptionals: false }));
    let validatedFields = {
      $set: matchedData(req, { includeOptionals: false })
    };
    let updatedEntity = await updateEntityFromDB(id, validatedFields);
    res.status(200).json(updatedEntity);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.updateFriendship = async (req, res) => {
  let userID = req.pararms.userID;
  let friendID = req.params.friendID;

  try {
    await checkIfUserIsAuthorized(req);

    /* status codes
	 * 0 - pending 
	 * 1 - rejecting
	 * 2 - friends
	*/
  } catch (error) {}
};
