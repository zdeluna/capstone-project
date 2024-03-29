const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

let UserSchema = new Schema(
  {
    email: {
      type: String
    },

    password: {
      type: String
    },

    username: {
      type: String
    },

    first_name: {
      type: String
    },

    last_name: {
      type: String
    },

    date_of_birth: {
      type: Date
    },

    location: {
      type: String
    },

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users"
      }
    ],

    pending_friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Friendship"
      }
    ],

    challenges: [
      {
        type: Schema.Types.ObjectId,
        ref: "Challenge"
      }
    ],

    conversations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Conversation"
      }
    ],

    pending_challenges: [
      {
        type: Schema.Types.ObjectId,
        ref: "ChallengeRequest"
      }
    ],

    records: [
      {
        type: Schema.Types.ObjectId,
        ref: "Record"
      }
    ],

    /* Additional fields if user signs in using Google */
    accessToken: String,
    provider: String,
    providerId: String
  },
  { strict: false }
);

// Consulted https://scotch.io/@devGson/api-authentication-with-json-web-tokensjwt-and-passport

UserSchema.methods.isCorrectPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

module.exports = mongoose.model("User", UserSchema);
