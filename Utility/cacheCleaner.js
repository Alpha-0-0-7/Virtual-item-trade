const fs = require("fs");
module.exports.clearItemPrices = function () {
    const pathList = __dirname.split("\\");
    pathList.pop();
    var path = pathList.join("\\") + "\\Cache\\";
    const gamesFolder = fs.readdirSync(path);
    for (var game in gamesFolder) {
        if (fs.existsSync(`${path}\\${gamesFolder[game]}\\itemPrices.json`)) {
            const itemPrices = JSON.parse(fs.readFileSync(`${path}\\${gamesFolder[game]}\\itemPrices.json`));
            const newList = {};
            for (var item in itemPrices) {
                if (itemPrices[item]["lastUpdate"] + 3600 * 1000 >= Date.now())
                    newList[item] = itemPrices[item];
            }
            fs.writeFileSync(`${path}\\${gamesFolder[game]}\\itemPrices.json`, JSON.stringify(newList));
        }
    }
}
module.exports.clearGamesData = function () {
    const pathList = __dirname.split("\\");
    pathList.pop();
    var path = pathList.join("\\") + "\\Cache\\";
    const gamesFolder = fs.readdirSync(path);
    for (var game in gamesFolder) {
        if (fs.existsSync(`${path}\\${gamesFolder[game]}\\gameInfo.json`)) {
            const gameData = JSON.parse(fs.readFileSync(`${path}\\${gamesFolder[game]}\\gameInfo.json`));
            if (gameData.lastUpdate + 7 * 24 * 3600 * 1000 < Date.now())
                fs.writeFileSync(`${path}\\${gamesFolder[game]}\\gameInfo.json`, JSON.stringify({}));
        }
    }
}