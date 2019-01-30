const model = require("../models/user.js");
var ObjectId = require("mongodb").ObjectId;

const getEntityFromDB = async id => {
  var objectId = new ObjectId(id);
  return new Promise((resolve, reject) => {
    model.findById(objectId, (error, entity) => {
      if (error) {
        reject();
      }

      if (!entity) {
        reject();
      }
      resolve(entity);
    });
  });
};

const deleteEntityFromDB = async id => {
  var objectId = new ObjectId(id);
  return new Promise((resolve, reject) => {
    model.deleteOne({ _id: objectId }, function(error) {
      if (error) reject();
      else resolve();
    });
  });
};

exports.getEntity = async (req, res) => {
  let id = req.params.id;
  try {
    var entity = await getEntityFromDB(id);
    res.status(200).json(entity);
  } catch (error) {
    res.status(404).json({
      errors: { msg: "USER_DOES_NOT_EXIST" }
    });
  }
};

exports.deleteEntity = async (req, res) => {
  let id = req.params.id;
  if (id !== req.user._id) {
    res.status(401).end();
    return;
  }

  try {
    var entity = await getEntityFromDB(id);
    if (entity) {
      await deleteEntityFromDB(id);
      res.status(204).end();
    }
  } catch (error) {
    res.status(404).json({
      errors: { msg: "USER_DOES_NOT_EXIST" }
    });
  }
};
