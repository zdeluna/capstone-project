const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let challengeSchema = new Schema({
  name: {
    type: String
    //required: true
  },

  start_date: {
    type: Date
    // required: true
  },

  activity: {
    type: String
    //required: true
  },

  measurement: {
    type: String
    //required: true
  },

  pending_participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "ChallengeRequest"
    }
  ],

  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message"
    }
  ],

  duration: {
    type: String
  },

  participants: [{ user_id: Schema.Types.ObjectId, total: Number }]
});

module.exports = mongoose.model("Challenge", challengeSchema);
