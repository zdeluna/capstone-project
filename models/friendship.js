const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let FriendshipSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  recipient: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  status: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Friendship", FriendshipSchema);
