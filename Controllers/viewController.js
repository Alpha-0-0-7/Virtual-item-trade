module.exports.homePage = function (req, res) {
    res.render("home.pug", {
        title: "Trade Helper",
        user: req.user,
    });
}

module.exports.gamesOwned = function (req, res) {
    res.render("gamesLibrary.pug", {
        title: "Games Library",
        user: req.user,
        games: req.games,
    });
}

module.exports.err404Page = function (req, res) {
    res.render("error404.pug", {
        title: "Error 404! Page not found!",
        user: req.user,
    });
}

module.exports.getGamePage = function (req, res) {
    res.render("gamePage.pug", {
        title: `${req.game.name}`,
        user: req.user,
        game: req.game,
    });
}

module.exports.get500Page = function (req, res) {
    res.render("error500.pug", {
        title: "Error 500 : Internal Server Error",
        user: req.user,
    });
}
module.exports.getInventoryPage = function (req, res) {
    res.render("inventory.pug", {
        title: `${req.user.name}'s Inventory`,
        user: req.user,
        inv: req.inv,
    });
};
module.exports.getTradeCenterPage = function (req, res) {
    res.render("tradeCenter.pug", {
        title: "Trade Helper Center",
        user: req.user,
        data: req.data,
    });
};