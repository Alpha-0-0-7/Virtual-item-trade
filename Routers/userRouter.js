const userRouter = require("express").Router();

const {
    getGamesOwned,
    getInventory,
    inventoryValue,
} = require("../Controllers/userController");

userRouter.get("/:userid/gamesOwned", getGamesOwned);
userRouter.get("/:userid/:gameid/inventory", getInventory);
userRouter.get("/:userid/:gameid/inventory/value", inventoryValue);

module.exports = userRouter;