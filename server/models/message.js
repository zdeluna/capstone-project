const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  content: {
    type: String,
    required: true
  },

  date: {
    type: Date
  }
});

module.exports = mongoose.model("Message", messageSchema);
