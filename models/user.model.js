const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
},
    { timestamps: true })

const User = mongoose.model("Users", userSchema);
module.exports = User;