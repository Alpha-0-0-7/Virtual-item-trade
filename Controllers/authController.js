module.exports.redirectToHome = function (req, res) {
    res.redirect('/');
};

module.exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}