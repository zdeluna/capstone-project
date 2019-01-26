const model = require('../models/user.js');
var ObjectId = require('mongodb').ObjectId;

const getEntityFromDB = async id => {
    var objectId = new ObjectId(id);
    return new Promise((resolve, reject) => {
        model.findById(objectId, (err, entity) => {
            if (err) {
                reject();
            }

            if (!entity) {
                reject();
            }
            resolve(entity);
        });
    });
};

exports.test = function(req, res) {
    res.send('Hello Word');
};

exports.getEntity = async (req, res) => {
    try {
        var entity = await getEntityFromDB(req.params.id);
        res.status(200).json(entity);
    } catch (error) {
        res.status(404).json('User does not exist');
    }
};
