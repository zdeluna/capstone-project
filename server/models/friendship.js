const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let FriendshipSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Users"
  },

  recipient: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Users"
  },

  status: {
    type: int,
    required: true
  }
});

module.exports = mongoose.model("Friendship", FriendshipSchema);
