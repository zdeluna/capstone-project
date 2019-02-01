const userModel = require("../models/user.js");
const friendshipModel = require("../models/friendship.js");
var ObjectId = require("mongodb").ObjectId;
const { matchedData } = require("express-validator/filter");

const getEntityFromDB = async (model, id) => {
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

const createPendingFriendships = async (userID, friendID) => {
  try {
    const friendshipUser = await friendshipModel.findOneAndUpdate(
      { sender: userID, recipient: friendID },
      { $set: { status: 1 } },
      { upsert: true, new: true }
    );

    const friendshipFriend = await friendshipModel.findOneAndUpdate(
      { sender: friendID, recipient: friendID },
      { $set: { status: 2 } },
      { upsert: true, new: true }
    );

    // Update the pending friendships field for user
    await userModel.findOneAndUpdate(
      { _id: userID },
      { $push: { pending_friends: friendshipUser._id } }
    );

    // Also update the pending friendship field for the friend
    await userModel.findOneAndUpdate(
      { _id: friendID },
      { $push: { pending_friends: friendshipFriend._id } }
    );
  } catch (error) {
    return error;
  }
};

const acceptFriendShip = async (userID, friendID) => {
  try {
    // Add friend ID to friends field of user

    await userModel.findOneAndUpdate(
      { _id: userID },
      { $push: { friends: friendID } }
    );

    // Add user ID to friends field of friends
    await userModel.findOneAndUpdate(
      { _id: friendID },
      { $push: { friends: userID } }
    );

    // Remove the friendship from pending friendships
  } catch (error) {
    return error;
  }
};

const deleteEntityFromDB = async (model, id) => {
  var objectId = new ObjectId(id);
  return new Promise((resolve, reject) => {
    model.deleteOne({ _id: objectId }, function(error) {
      if (error) reject({ statusCode: 422, msg: error.message });
      else resolve();
    });
  });
};

const updateEntityFromDB = async (model, id, data) => {
  var objectId = new ObjectId(id);
  return new Promise((resolve, reject) => {
    model.findByIdAndUpdate(objectId, data, { new: true }, (error, entity) => {
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
    var entity = await getEntityFromDB(userModel, id);
    res.status(200).json(entity);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.deleteEntity = async (req, res) => {
  let id = req.params.id;

  try {
    await checkIfUserIsAuthorized(req);
    await getEntityFromDB(userModel, id);

    await deleteEntityFromDB(userModel, id);
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
    let updatedEntity = await updateEntityFromDB(
      userModel,
      id,
      validatedFields
    );
    res.status(200).json(updatedEntity);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.updateFriendship = async (req, res) => {
  let userID = new ObjectId(req.params.userID);
  let friendID = new ObjectId(req.params.friendID);
  let status = req.body.status;

  try {
    switch (status) {
      case "0":
        createPendingFriendships(userID, friendID);
        break;
      case "4":
        acceptFriendShip(userID, friendID);
    }
    console.log("in try");
    //await checkIfUserIsAuthorized(req);
    /* Consulted https://stackoverflow.com/questions/50363220/modelling-for-friends-schema-in-mongoose?noredirect=1&lq=1*/

    /* status codes
	 * 0 - add friend
	 * 1 - requested
	 * 2 - pending
	 * 3 - reject
	 * 4 - accept 
	*/

    res.status(200).end();
  } catch (error) {
    sendErrorMessage({ statusCode: 422, msg: error.message });
  }
};
