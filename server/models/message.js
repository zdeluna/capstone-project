const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    content: {
      type: String
    },

    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message"
      }
    ]
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("Message", messageSchema);
