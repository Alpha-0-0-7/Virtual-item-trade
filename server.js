const steamApi = process.env.STEAM_API || require('./KEYS/secrets').STEAM_API;
const sessionKey = process.env.SESSION_KEY || require('./KEYS/secrets').SESSION_KEY;
const dbLink = process.env.DB_LINK || require("./KEYS/secrets").DB_LINK;
const path = require("path");
const express = require('express')
    , passport = require('passport')
    , session = require('express-session')
    , SteamStrategy = require('passport-steam').Strategy;
const MongoStore = require('connect-mongo')(session);
const mongoose = require("mongoose");
const userModel = require("./Models/userModel");
const gameRouter = require("./Routers/gameRouter");
const userRouter = require("./Routers/userRouter");
const viewRouter = require("./Routers/viewRouter");
const authRouter = require("./Routers/authRouter");
const app = express();
// **************************************************************************************************
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
    try {
        const user = await userModel.findOne({ id });
        done(null, user);
    }
    catch (err) {
        done(err, undefined);
    }
});
// Strategies in passport require a `validate` function, which accept
// credentials (in this case, an id identifier and profile), and invoke a
// callback with a user object.
// FIXED structure for "steam strategy"
// "done" is a callback function required in passport
const returnURL = process.env.NODE_ENV === "production" ? `https://tradehelper.herokuapp.com/auth/steam/return/` : `http://localhost:3000/auth/steam/return/`;
const webURL = process.env.NODE_ENV === "production" ? `https://tradehelper.herokuapp.com/` : 'http://localhost:3000/';
//-momery unleaked---------
passport.use(new SteamStrategy({
    returnURL: returnURL,
    realm: webURL,
    apiKey: steamApi
},
    // This function is called when user signs in
    async function (identifier, profile, done) {
        // "profile" contains profile info JSON
        try {
            const user = await userModel.findOne({
                id: profile.id,
            });
            // If user already exists in DB
            if (user) {
                return done(null, user);
            }
            // If the user does not exists in DB, 
            // then we will create a new user in DB
            else {
                var photos = [];
                for (var photo in profile.photos) {
                    photos.push(profile.photos[photo]["value"]);
                }
                const user = await userModel.create({
                    name: profile.displayName,
                    id: profile.id,
                    profileURL: profile._json.profileurl,
                    photos: photos,
                });
                return done(null, user);
            }
        }
        catch (err) {
            return done(null, undefined);
        }
    }
));
// Prevents Memory Leaks
mongoose
    .connect(
        dbLink, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
    )
    .then(function (db) {
        console.log("SessionDB connected");
    })
    .catch(function (err) {
        console.log(err);
    });
var sess = {
    secret: sessionKey,
    name: 'trade-session',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 3600 * 1000,
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
};
app.use(session(sess));

// Initialize Passport!  
// Also use passport.session() middleware, to support persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
// *********************************************************
// This method can be used for authenticated access pages
// Like profile page etc
// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) { return next(); }
//     res.redirect('/');
// }
// *********************************************************
// **************************************************************************************************
// Public
app.use(express.json());
app.use(express.static('public'));
// Views
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "Views"));
// Routers
app.use("/steam/game", gameRouter);
app.use("/steam/user", userRouter);
app.use('/auth', authRouter);
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
app.use("/", viewRouter);
// Server start
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Server started at port ${PORT}`);
});
// Cache Related
const {
    clearItemPrices
} = require("./Utility/cacheCleaner");
setInterval(clearItemPrices, 3600 * 1000);