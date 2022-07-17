const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");


const UserSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, select: false, required: true },
    },
    {
        timestamps: true
    });

UserSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            userId: this._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

module.exports = mongoose.model("User", UserSchema);
