const model = require("../models/user.js");
var ObjectId = require("mongodb").ObjectId;

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
      if (error) reject({ statusCode: 422, msg: error.message });
      if (!entity) reject({ statusCode: 404, msg: USER_DOES_NOT_EXIST });

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
  try {
    await checkIfUserIsAuthorized();
    let data = { $set: req.body };
    let updatedEntity = await updateEntityFromDB(id, data);
    res.status(200).json(updatedEntity);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
