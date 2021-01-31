var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    googleID: String,
    email: String,
    username: String,
    profileImage: String,
    address: {
        street: String,
        pincode: String,
        city: String,
        mobileNumber: String,
        country:String
        
        
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);