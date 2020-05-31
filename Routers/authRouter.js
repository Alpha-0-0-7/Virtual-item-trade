const authRouter = require("express").Router();
const passport = require('passport')

const {
    redirectToHome,
} = require("../Controllers/authController");

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.
authRouter.get("/steam", passport.authenticate('steam', { failureRedirect: '/' }), function (req, res) {
    // The request will be redirected to Steam for authentication, so
    // this function will not be called.
});

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
authRouter.get('/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), redirectToHome);

module.exports = authRouter;