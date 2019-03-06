const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Activity = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  // User can submit a description of the activity such as "Biked around the lkae"
  description: {
    type: String,
    required: false
  },

  // The type of activity, "BIKING, "RUNNING", "WALKING", etc
  type: {
    type: String,
    required: true
  },

  // The date of activity
  date: {
    type: Date,
    required: true
  },

  // The unit of measurement such as "steps" or "time"
  measurement: {
    type: String,
    required: true
  },

  units: {
    type: String,
    required: true
  },

  // The amount of activity
  value: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Activity", Activity);
