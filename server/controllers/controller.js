const userModel = require("../models/user.js");
const friendshipModel = require("../models/friendship.js");
var ObjectId = require("mongodb").ObjectId;

exports.getEntityFromDB = async (model, id) => {
  let objectId = new ObjectId(id);
  return new Promise((resolve, reject) => {
    model.findById(objectId, (error, entity) => {
      if (error) {
        reject({ statusCode: 422, msg: error.message });
      }

      if (!entity) {
        reject({
          statusCode: 404,
          msg:
            "DOES_NOT_EXIST_IN_" + model.collection.collectionName.toUpperCase()
        });
      }
      resolve(entity);
    });
  });
};

exports.getAllEntitiesFromDB = async model => {
  return new Promise((resolve, reject) => {
    model.find({}, function(error, entities) {
      if (error) {
        reject({ statusCode: 422, msg: error.message });
      }

      if (!entities) {
        console.log("NOOOOOOO");

        reject({
          statusCode: 404,
          msg:
            "DOES_NOT_EXIST_IN_" + model.collection.collectionName.toUpperCase()
        });
      }
      resolve(entities);
    });
  });
};

exports.deleteEntityFromDB = async (model, id) => {
  var objectId = new ObjectId(id);
  return new Promise((resolve, reject) => {
    model.deleteOne({ _id: objectId }, function(error) {
      if (error) reject({ statusCode: 422, msg: error.message });
      else resolve();
    });
  });
};

exports.updateEntityFromDB = async (model, id, data) => {
  var objectId = new ObjectId(id);
  return new Promise((resolve, reject) => {
    model.findByIdAndUpdate(objectId, data, { new: true }, (error, entity) => {
      if (error) reject({ statusCode: 422, msg: error.message });
      if (!entity)
        reject({
          statusCode: 404,
          msg:
            "DOES_NOT_EXIST_IN_" + model.collection.collectionName.toUpperCase()
        });

      resolve(entity);
    });
  });
};

exports.sendErrorResponse = async (res, error) => {
  res.status(error.statusCode).json({ errors: { msg: error.msg } });
};

exports.checkIfUserIsAuthorized = async (id_of_user_to_update, req) => {
  return new Promise((resolve, reject) => {
    if (id_of_user_to_update !== req.user._id) {
      reject({ statusCode: 401, msg: "USER_IS_NOT_AUTHORIZED" });
    }
    resolve();
  });
};
