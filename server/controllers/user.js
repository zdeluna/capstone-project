const userModel = require("../models/user.js");
const friendshipModel = require("../models/friendship.js");
const challengeRequestModel = require("../models/challengeRequest.js");
var ObjectId = require("mongodb").ObjectId;
const { matchedData } = require("express-validator/filter");
const {
  getEntityFromDB,
  getAllEntitiesFromDB,
  deleteEntityFromDB,
  updateEntityFromDB,
  sendErrorResponse,
  checkIfUserIsAuthorized
} = require("./controller.js");

const createPendingFriendships = async (userID, friendID) => {
  try {
    const friendshipUser = await friendshipModel.findOneAndUpdate(
      { sender: userID, recipient: friendID },
      { $set: { status: 1 } },
      { upsert: true, new: true }
    );

    const friendshipFriend = await friendshipModel.findOneAndUpdate(
      { sender: friendID, recipient: userID },
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

const removePendingFriends = async (userID, friendID) => {
  // Store the document of the friendship where user is the sender, we will use the id to remove it from the pending friends field
  const friendshipUser = await friendshipModel.findOne({
    sender: userID,
    recipient: friendID
  });

  // Remove from pending friends of user
  await userModel.findOneAndUpdate(
    { _id: userID },
    { $pull: { pending_friends: friendshipUser._id } }
  );

  // Do the same thing, but for the friend
  const friendshipFriend = await friendshipModel.findOne({
    sender: friendID,
    recipient: userID
  });

  // Remove from pending friends of friend
  await userModel.findOneAndUpdate(
    { _id: friendID },
    { $pull: { pending_friends: friendshipFriend._id } }
  );

  // Remove both friendships from the friendships table
  await deleteEntityFromDB(friendshipModel, friendshipUser._id);
  await deleteEntityFromDB(friendshipModel, friendshipFriend._id);
};

const acceptFriendship = async (userID, friendID) => {
  try {
    // Add the friend ID to user's friends field
    await userModel.findOneAndUpdate(
      { _id: userID },
      { $push: { friends: friendID } }
    );

    // Add the friend ID to user's friends field
    await userModel.findOneAndUpdate(
      { _id: friendID },
      { $push: { friends: userID } }
    );

    await removePendingFriends(userID, friendID);
  } catch (error) {
    return error;
  }
};

const deleteFriendshipFromDB = async (userID, friendID) => {
  try {
    // Delete friendID from user table
    await userModel.findOneAndUpdate(
      { _id: userID },
      { $pull: { friends: friendID } }
    );
    // Delete userID from friend's user table
    await userModel.findOneAndUpdate(
      { _id: friendID },
      { $pull: { friends: userID } }
    );
  } catch (error) {
    return error;
  }
};

/* Public Functions that are directly called by the routers */
exports.getUser = async (req, res) => {
  var id = req.params.id;
  var pending_friends = [];
  var pending_challenges = [];

  try {
    // Convert the mongodb document to a javascript object to display informationa about the friend request and not just the friendship object id number
    // https://stackoverflow.com/questions/14768132/add-a-new-attribute-to-existing-json-object-in-node-js/29131856
    var user = JSON.parse(JSON.stringify(await getEntityFromDB(userModel, id)));
    for (let i = 0; i < user.pending_friends.length; i++) {
      let friendship = await getEntityFromDB(
        friendshipModel,
        user.pending_friends[i]
      );
      pending_friends[i] = {
        user: friendship.recipient,
        status: friendship.status
      };
    }
    user.pending_friends = pending_friends;

    for (let c = 0; c < user.pending_challenges.length; c++) {
      let challengeRequest = await getEntityFromDB(
        challengeRequestModel,
        user.pending_challenges[c]
      );

      pending_challenges[c] = {
        id: challengeRequest.challenge_id,
        status: challengeRequest.status
      };
    }

    user.pending_challenges = pending_challenges;

    res.status(200).json(user);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.deleteEntity = async (req, res) => {
  try {
    let id = req.params.id;
    await checkIfUserIsAuthorized(id, req);
    await getEntityFromDB(userModel, id);

    await deleteEntityFromDB(userModel, id);
    res.status(204).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.updateEntity = async (req, res) => {
  try {
    let id = req.params.id;
    await checkIfUserIsAuthorized(id, req);

    // Use the matched data function of validator to return data that was validated thru express-validaotr. Optional data will be included
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

/* Consulted https://stackoverflow.com/questions/50363220/modelling-for-friends-schema-in-mongoose?noredirect=1&lq=1 */
exports.updateFriendship = async (req, res) => {
  try {
    await checkIfUserIsAuthorized(req.params.userID, req);

    let userID = new ObjectId(req.params.userID);
    let friendID = new ObjectId(req.params.friendID);
    let status = req.body.status;

    switch (status) {
      case "0":
        await createPendingFriendships(userID, friendID);
        break;
      case "3":
        await acceptFriendship(userID, friendID);
        break;
      case "4":
        await removePendingFriends(userID, friendID);
        break;
    }

    res.status(200).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.deleteFriendship = async (req, res) => {
  try {
    await checkIfUserIsAuthorized(req.params.userID, req);

    let userID = new ObjectId(req.params.userID);
    let friendID = new ObjectId(req.params.friendID);

    await deleteFriendshipFromDB(userID, friendID);
    res.status(204).end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    console.log("in function");
    let users = await getAllEntitiesFromDB(userModel);

    // Change the friendship foreign key id to the actual user id of the pending friendship
    for (let k = 0; k < users.length; k++) {
      users[k] = JSON.parse(JSON.stringify(users[k]));
      pending_friends = [];
      for (let i = 0; i < users[k].pending_friends.length; i++) {
        let friendship = await getEntityFromDB(
          friendshipModel,
          users[k].pending_friends[i]
        );
        pending_friends[i] = {
          user: friendship.recipient,
          status: friendship.status
        };
      }
      users[k].pending_friends = pending_friends;
    }

    res.status(200).json(users);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
