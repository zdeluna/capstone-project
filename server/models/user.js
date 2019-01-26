const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        //required: true,
    },

    accessToken: String,
    provider: String,
    providerId: String,
});

// Consulted https://scotch.io/@devGson/api-authentication-with-json-web-tokensjwt-and-passport
/*
UserSchema.pre('save', async function(next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});
*/

UserSchema.methods.isCorrectPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

module.exports = mongoose.model('User', UserSchema);
