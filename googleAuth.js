const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./api/models/users');

module.exports = function (passport) {
    
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
        async function (accessToken, refreshToken, profile, cb) {
            var profileJson = profile._json;

            const existingUser = await User.findOne({ googleID: profile.id });

            if (existingUser) {
                // we already have a record with the given profile ID

                cb(null, existingUser);
            }
            else {
                var newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    googleID: profile.id,
                    username: profileJson.name,
                    email: profileJson.email,
                    profileImage: profileJson.picture

                });
                const savedUser = await newUser.save();
                cb(null, savedUser);

            }
        }


    ));
};