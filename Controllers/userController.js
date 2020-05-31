const steamApi = process.env.STEAM_API || require('../KEYS/secrets').STEAM_API;
const axios = require("axios");
const fs = require("fs");
const userModel = require("../Models/userModel");

function createIfAbsent(ID) {
    const list = __dirname.split("\\");
    list.pop();
    var path = list.join("\\") + "\\Cache\\" + ID;
    if (fs.existsSync(path))
        return;
    else
        fs.mkdirSync(path);
}

module.exports.getGamesOwned = async function (req, res) {
    var url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApi}&steam=${req.params.userid}`;
    try {
        const response = await axios.get(url);
        res.status(200).json({
            status: "Info received",
            data: response.data.response,
        });
    }
    catch (err) {
        console.log(err.message);
        res.redirect("/error500");
    }
};
module.exports.getInventory = async function (req, res) {
    var urlInventory = `http://steamcommunity.com/inventory/${req.params.userid}/${req.params.gameid}/2?l=english&count=5000`;
    createIfAbsent(req.params.gameid);
    try {
        const response = await axios.get(urlInventory);
        res.status(200).json({
            status: "Info received",
            data: response.data,
        });
    }
    catch (err) {
        console.log(err.message);
        res.redirect("/error500");
    }
};
function replace(str) {
    return str.replace(/ /g, "%20").replace("|", "%7C").replace("(", "%28").replace(")", "%29");
}
module.exports.inventoryValue = async function (req, res) {
    var urlInventory = `http://steamcommunity.com/inventory/${req.params.userid}/${req.params.gameid}/2?l=english&count=5000`;
    createIfAbsent(req.params.gameid);
    try {
        const response = await axios.get(urlInventory);
        var cachedPrices = {};
        const pathList = __dirname.split("\\");
        pathList.pop();
        var path = pathList.join("\\") + "\\Cache\\" + req.params.gameid + "\\itemPrices.json";
        if (fs.existsSync(path)) {
            cachedPrices = JSON.parse(fs.readFileSync(path));
        }
        const list = response.data.descriptions;
        // Usage to sets to reduce the number of calls to same item
        let setHashNames = new Set();
        for (var item in list) {
            if (list[item]["marketable"] == 1) {
                setHashNames.add(list[item]["market_hash_name"]);
            }
        }
        setHashNames = Array.from(setHashNames);
        const listResponses = [], names = [];
        const prices = [];
        for (var itemName in setHashNames) {
            if (setHashNames[itemName] in cachedPrices && cachedPrices[setHashNames[itemName]]["lastUpdate"] + 3600 * 1000 >= Date.now()) {
                prices.push(cachedPrices[setHashNames[itemName]]);
            }
            else {
                var query = replace(setHashNames[itemName]);
                var urlMarket = `https://steamcommunity.com/market/priceoverview/?currency=24&appid=${req.params.gameid}&market_hash_name=${query}`;
                const priceResponse = axios.get(urlMarket);
                listResponses.push(priceResponse);
                names.push(setHashNames[itemName]);
            }
        }
        var index = 0;
        const priceList = await Promise.all(listResponses);
        for (var item in priceList) {
            prices.push(priceList[item].data);
            cachedPrices[names[index]] = priceList[item].data;
            cachedPrices[names[index++]]["lastUpdate"] = Date.now();
        }
        // Over writing previous records with new/updated records
        fs.writeFileSync(path, JSON.stringify(cachedPrices));
        res.status(200).json({
            status: "Info received",
            data: prices,
        });
    }
    catch (err) {
        console.log(err.message);
        res.redirect("/error500");
    }
}