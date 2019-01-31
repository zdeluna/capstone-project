const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

let UserSchema = new Schema({
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

  DOB: {
    type: Date
  },

  /* Additional fields if user signs in using Google */
  accessToken: String,
  provider: String,
  providerId: String
});

// Consulted https://scotch.io/@devGson/api-authentication-with-json-web-tokensjwt-and-passport

UserSchema.methods.isCorrectPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

module.exports = mongoose.model("User", UserSchema);
