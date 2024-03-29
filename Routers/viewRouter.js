const viewRouter = require("express").Router();
const {
    homePage,
    gamesOwned,
    err404Page,
    get500Page,
    getGamePage,
    getInventoryPage,
    getTradeCenterPage,
} = require("../Controllers/viewController");
const {
    ensureAuthenticated,
} = require("../Controllers/authController");
const {
    getOwnedgames,
    getGameDetails,
} = require("../Controllers/gameController");
const {
    getInventory,
    inventoryValue,
    scrapper,
} = require("../Controllers/userController");

viewRouter.get("/:appid/details", getGameDetails, getGamePage);
viewRouter.get("/ownedGames", ensureAuthenticated, getOwnedgames, gamesOwned);
viewRouter.get("/", homePage);
viewRouter.get("/error500", get500Page);
viewRouter.get("/userInventory", ensureAuthenticated, getInventory, inventoryValue, getInventoryPage);
viewRouter.get("/tradeCenter", scrapper, getTradeCenterPage)
viewRouter.get("/*", err404Page);

module.exports = viewRouter;