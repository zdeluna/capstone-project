const userModel = require("../models/user.js");
const friendshipModel = require("../models/friendship.js");
const challengeModel = require("../models/challenge.js");
const messageModel = require("../models/message.js");
const conversationModel = require("../models/conversation.js");

var ObjectId = require("mongodb").ObjectId;

/**
 * Get an entity from the
 * @param {Model} model
 * @param {string} id
 * @returns Promise containing entity
 */

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

/**
 * Get all entities of a collection
 * @param {Model} model
 * @returns Promise containing entities
 */

exports.getAllEntitiesFromDB = async model => {
  return new Promise((resolve, reject) => {
    model.find({}, function(error, entities) {
      if (error) {
        reject({ statusCode: 422, msg: error.message });
      }

      if (!entities) {
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

/**
 * Delete an entity from the collection
 * @param {Model} model
 * @param {string} id
 * @returns Promise
 */

exports.deleteEntityFromDB = async (model, id) => {
  var objectId = new ObjectId(id);
  return new Promise((resolve, reject) => {
    model.findOneAndDelete({ _id: objectId }, function(error) {
      if (error) reject({ statusCode: 422, msg: error.message });
      else resolve();
    });
  });
};

/**
 * Create an entity in the collection
 * @param {Model} model
 * @param {Object} data
 * @returns Promise
 */

exports.createEntityInDB = async (model, data) => {
  return new Promise((resolve, reject) => {
    model.create(data, function(error, response) {
      if (error) {
        reject({ statusCode: 422, msg: error.message });
      } else resolve(response);
    });
  });
};

/**
 * Create an entity in the collection
 * @param {Model} model
 * @param {string} id
 * @param {Object} data
 * @returns Promise
 */

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

/**
 * Remove an id (foreignkeyID )in an array in model in a collection with id
 * primaryID
 * @param {Model} model
 * @param {string} fieldName
 * @param {string} primaryID,
 * @param {string} foreignkeyID
 * @returns Promise
 */

exports.removeFromFieldArray = async (
  model,
  fieldName,
  primaryID,
  foreignkeyID
) => {
  return new Promise((resolve, reject) => {
    let query = { [fieldName]: foreignkeyID };
    model.findOneAndUpdate({ _id: primaryID }, { $pull: query }, function(
      error,
      entity
    ) {
      if (error) reject({ statusCode: 422, msg: error.message });
      else resolve(entity);
    });
  });
};

/**
 * Send an error response using the status code and message of error object
 * @param {Model} model
 * @param {Object} errror
 */

exports.sendErrorResponse = (res, error) => {
  res.status(error.statusCode).json({ errors: { msg: error.msg } });
};

/**
 * Check if the user's credients give them access to update the resource
 * @param {string} id_of_user_to_update
 * @param {Object} request
 * @returns Promise
 */

exports.checkIfUserIsAuthorized = async (id_of_user_to_update, req) => {
  return new Promise((resolve, reject) => {
    if (id_of_user_to_update !== req.user._id) {
      reject({ statusCode: 403, msg: "USER_IS_NOT_AUTHORIZED" });
    }
    resolve();
  });
};
