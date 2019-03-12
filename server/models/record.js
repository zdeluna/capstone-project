const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Record = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  // The type of record such as "20,000 Steps in A Day"
  type: {
    type: String,
    required: true
  },

  // The date of when the record was achieved
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Record", Record);
