const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ChallengeRequestSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  challenge_id: {
    type: Schema.Types.ObjectId,
    ref: "Challenge"
  },

  status: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("ChallengeRequest", ChallengeRequestSchema);
