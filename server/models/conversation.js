/* Consulted https://blog.slatepeak.com/creating-a-real-time-chat-api-with-node-express-socket-io-and-mongodb/*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let conversationSchema = new Schema({
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
});

module.exports = mongoose.model("Conversation", conversationSchema);
