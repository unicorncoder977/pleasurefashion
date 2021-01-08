var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:String,
    username: String,
    password: String,
    profileImage:String
});

UserSchema.plugin(passportLocalMongoose,{usernameField:'email'}); 

module.exports = mongoose.model("User", UserSchema);