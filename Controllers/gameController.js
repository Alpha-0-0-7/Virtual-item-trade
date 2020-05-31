const steamApi = process.env.STEAM_API || require('../KEYS/secrets').STEAM_API;
const axios = require("axios");
const fs = require("fs");

function createIfAbsent(ID) {
    const list = __dirname.split("\\");
    list.pop();
    var path = list.join("\\") + "\\Cache\\" + ID;
    if (fs.existsSync(path))
        return;
    else
        fs.mkdirSync(path);
}

module.exports.getAcheivements = async function (req, res) {
    var url = `http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${steamApi}&appid=${req.params.appid}`;
    try {
        const resposne = await axios.get(url);
        res.status(200).json({
            status: "GGWP",
            data: resposne.data.game.availableGameStats.achievements,
        });
    }
    catch (err) {
        console.log(err.message);
        res.redirect("/error500");
    }
};

module.exports.getGameDetails = async function (req, res, next) {
    const urlGame = `https://store.steampowered.com/api/appdetails/?appids=${req.params.appid}`;
    const urlAcheivementsDetailed = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${steamApi}&appid=${req.params.appid}`;
    createIfAbsent(req.params.appid);
    try {
        // Caching
        var cachedPrices = {};
        const pathList = __dirname.split("\\");
        pathList.pop();
        var path = pathList.join("\\") + "\\Cache\\" + req.params.appid + "\\gameInfo.json";
        if (fs.existsSync(path)) {
            req.game = JSON.parse(fs.readFileSync(path));
            // Updating data every week
            if (req.game["lastUpdate"] + 7 * 24 * 3600 * 1000 < Date.now()) {
                const responseForGame = await axios.get(urlGame);
                req.game = responseForGame.data[`${req.params.appid}`].data;
                req.game["lastUpdate"] = Date.now();
                if (req.game.achievements.total > 0) {
                    const responseForGameAcheivements = await axios.get(urlAcheivementsDetailed);
                    req.game["achievements"] = responseForGameAcheivements.data["game"]["availableGameStats"]["achievements"];
                    for (var i = 0; i < req.game["achievements"].length; i++) {
                        req.game["achievements"][i]["achieved"] = 0;
                    }
                }
                else {
                    req.game.achievements = [];
                }
                fs.writeFileSync(path, JSON.stringify(req.game));
            }
        }
        else {
            const responseForGame = await axios.get(urlGame);
            req.game = responseForGame.data[`${req.params.appid}`].data;
            req.game["lastUpdate"] = Date.now();
            if (req.game.achievements.total > 0) {
                const responseForGameAcheivements = await axios.get(urlAcheivementsDetailed);
                req.game["achievements"] = responseForGameAcheivements.data["game"]["availableGameStats"]["achievements"];
                for (var i = 0; i < req.game["achievements"].length; i++) {
                    req.game["achievements"][i]["achieved"] = 0;
                }
            }
            else {
                req.game.achievements = [];
            }
            fs.writeFileSync(path, JSON.stringify(req.game));
        }
        try {
            if (req.user && req.game.achievements.length > 0) {
                const userAcheivements = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${steamApi}&steamid=${req.user.id}&appid=${req.params.appid}`;
                const responseForUserAcheivements = await axios.get(userAcheivements);
                for (var i = 0; i < req.game["achievements"].length; i++) {
                    req.game["achievements"][i]["achieved"] = responseForUserAcheivements.data.playerstats.achievements[i]["achieved"];
                }
            }
        }
        catch (err) {
            // Do nothing if player acheivements are not found
        }
        //Popping first image for slideshow
        var firstImage = req.game.screenshots.shift();
        req.game.firstScreenShot = firstImage;
        next();
    }
    catch (err) {
        console.log(err);
        res.redirect("/error500");
    }
}

module.exports.getOwnedgames = async function (req, res, next) {
    var url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApi}&steamid=${req.user.id}&format=json&include_appinfo=1`;
    try {
        const response = await axios.get(url);
        req.games = response.data.response.games;
        next();
    }
    catch (err) {
        console.log(err.message);
        res.redirect("/error500");
    }
}