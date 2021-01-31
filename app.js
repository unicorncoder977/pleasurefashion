const port = process.env.PORT || 3000;

const express = require('express');
const app = express();




const orderRoutes = require('./api/routes/orders');
productRoutes = require('./api/routes/products');
searchRoutes = require('./api/routes/search');
tagRoutes = require('./api/routes/tags');
commentRoutes = require('./api/routes/comments');
cartRoutes = require('./api/routes/cart');
wishlistRoutes = require('./api/routes/wishlist');
paperWorkRoutes = require('./api/routes/paperwork');

mongoose = require('mongoose');
bodyParser = require('body-parser');
methodOverride = require('method-override');
flash = require('connect-flash');
session = require('express-session');
Product = require('./api/models/product');
// User = require('./api/models/users');
morgan = require('morgan');
// axios = require('axios');
dotenv = require('dotenv').config();
nodemailer = require('nodemailer');
Cart = require('./api/models/cart');
Razorpay = require('razorpay');

const User = require('./api/models/users');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const checkCart = require('./api/middlewares/check-cart');

const compression = require('compression');

const path = require('path');

app.use(compression());
app.set('view engine', 'ejs');




mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);




// ==============
//MiddleWares
// ==============

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));
app.use(morgan('dev'));

// ==============
//Passport Config
// ==============
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, async (accessToken, refreshToken, profile, cb) => {

    var profileJson = profile._json;

    const existingUser = await User.findOne({ googleID: profile.id });
    if (existingUser) {
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

app.use(
    require("express-session")({

        secret: "Raj loves his friends",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());





// razorpay key ids

var RAZOR_PAY_KEY_ID = 'rzp_test_pG5ZsBewvcRAo8';
var RAZOR_PAY_KEY_SECRET = 'sFWzimejIdANS7p60CfyobJ9';



//razorpay instance
const instance = new Razorpay({
    key_id: RAZOR_PAY_KEY_ID,
    key_secret: RAZOR_PAY_KEY_SECRET,
});

//local variables middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();

});




//routes which handle requests
app.get('/', (req, res) => {
    res.render('users/signup');
});

// Middleware - Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next() : res.redirect('/');
}

app.get('/index', checkUserLoggedIn, (req, res) => {
    res.render('index');
});

app.get('/failed', (req, res) => {
    res.send('<h1>Log in Failed :(</h1>')
});



//Protected Route.
app.get('/profile', checkUserLoggedIn, (req, res) => {

    res.redirect('/index');
});

// Auth Routes



app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function (req, res) {
        res.redirect('/profile');
    }
);

//Logout
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
});



app.use('/products', checkUserLoggedIn, productRoutes);
app.use('/cart', checkUserLoggedIn, checkCart, cartRoutes);
app.use('/orders', checkUserLoggedIn, orderRoutes);
app.use('/wishlist', checkUserLoggedIn, wishlistRoutes);
app.use('/search', checkUserLoggedIn, searchRoutes);
app.use('/tags', checkUserLoggedIn, tagRoutes);
app.use('/comments', checkUserLoggedIn, commentRoutes);
app.use('/paperwork', paperWorkRoutes);
app.get('/buy', (req, res, next) => {
 
    // var productPrice = parseFloat(req.body.productPrice);
    // console.log(productPrice, typeof (productPrice));
    // var productQuantity = parseFloat(req.body.productQuantity);
    // console.log(productQuantity, typeof (productQuantity));
    // var totalAmount=productPrice*productQuantity;
    // console.log(totalAmount);

    // const product = await Product.findOne({ _id: productId }).exec();
    res.render('address.ejs',{totalAmount:899});

});


app.post('/address', async (req, res, next) => {
    const newAddress ={
        street: req.body.address,
        pincode: req.body.pincode,
        city: req.body.city,
        mobile: req.body.mobile,
        country:req.body.country
    }

    
    const response = await  User.findOneAndUpdate({ _id: req.user._id }, { $set: { address: newAddress } }).exec();
    const updatedUser = await User.findOne({ _id: req.user._id }).exec();

    

    
});



//404 page not found
app.get('*', (req, res) => {
    res.render('notFound');
});



//connecting to the mongo db database
const connect = async () => {
    const dbUrl = process.env.DB_URL;

    return mongoose.connect(dbUrl,
        { useUnifiedTopology: true },
        { useNewUrlParser: true }
    );

}

connect().then(() => {
    console.log("connected to mongo atlas db");
}).catch(err => console.log(err));



//to start listening for incoming requests
app.listen(port, () => {
    console.log("Pleasure Site Server has started on port " + port);
});