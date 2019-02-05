const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let challengeSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  start_date: {
    type: Date,
    required: true
  },

  activity: {
    type: String,
    required: true
  },

  measurement: {
    type: String,
    required: true
  },

  duration: {
    type: Number
  },

  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model("Challenge", challengeSchema);
