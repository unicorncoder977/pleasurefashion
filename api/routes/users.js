const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
const passport = require('passport');
const localStrategy = require('passport-local');
const userController = require('../controllers/users');
const multer = require('multer');
const { Store } = require('express-session');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null,path.join('./uploads'));

    },
    filename: (req, file, cb) => {
        cb(null,file.originalname)
    }

});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        req.fileValidationError = 'please upload either a png or jpeg file';
        
        req.flash('error', req.fileValidationError);
        return cb(null,false,req.fileValidationError);
    }

}
const upload = multer(
    {
        storage: storage,
        limits: {
            //max file size is 1mb
            fileSize: 1024 * 1024 * 1
        },
        fileFilter: fileFilter
    });

// show sign up page
router.get('/signup', userController.show_signup_page);

//handle users sign up
router.post("/signup", upload.single('profileImage'), userController.users_signup_user);

//show login page
router.get('/login', userController.show_login_page);

//handle users login
router.post("/login", passport.authenticate("local", { successRedirect: "/index", failureRedirect: '/users/login', failureFlash: true }), (req, res) => { });

//handle users logout
router.get("/logout", userController.users_logout_user);



module.exports = router;