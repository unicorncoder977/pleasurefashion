
const User = require('../models/users');
const passport = require('passport');
const localStrategy = require('passport-local');
const app = require('express')();
app.use(
    require("express-session")({

        secret: "Raj loves his friends",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));