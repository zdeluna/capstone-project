const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  content: {
    type: String
  },

  date: {
    type: Date
  }
});

module.exports = mongoose.model("Message", messageSchema);
