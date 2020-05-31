const gameRouter = require("express").Router();

const {
    getAcheivements,
} = require("../Controllers/gameController");

gameRouter.get("/:appid/achievements", getAcheivements);

module.exports = gameRouter;