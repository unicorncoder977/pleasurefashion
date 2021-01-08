const User = require('../models/users');
const passport = require('passport');
const express = require('express');
const app = express();
const mongoose = require("mongoose");


exports.show_signup_page = (req, res) => {

    res.render('users/signup');
}

exports.users_signup_user = async (req, res, err) => {

    if (req.fileValidationError) {

        return res.redirect('/users/signup');

    }
    res.locals.profileImage = req.file.path;


    var newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        username: req.body.username,
        profileImage: req.file.path,
    });



    const response1 = await User.findOne({ email: req.body.email }).exec();
    // const response2 = await User.findOne({ username: req.body.username }).exec();
    var isValid = true;

    if (response1) {


        req.flash('error', 'email already exists');
        res.redirect('/users/signup');


    }
    else {
        User.register(newUser, req.body.password, (err, user) => {
            console.log(user);

            if (err) {

                req.flash("error", err.message);
                return res.redirect("/users/signup");
            }

            passport.authenticate("local")(req, res, function () {

                req.flash("success", "Welcome, " + user.username + "!");
                res.redirect('/index');
            });

        });
    }

}



exports.show_login_page = (req, res) => {
    res.render('users/login');
}

exports.users_logout_user = (req, res) => {

    req.logOut();
    req.flash("success", "Logged you out!");
    res.redirect("/index");
}




