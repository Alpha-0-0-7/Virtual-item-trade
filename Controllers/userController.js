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
module.exports.getInventory = async function (req, res, next) {
    var urlInventoryCSGO = `https://steamcommunity.com/inventory/${req.user.id}/730/2`;
    var urlInventoryDOTA = `https://steamcommunity.com/inventory/${req.user.id}/570/2`;
    try {
        const responseCSGO = await axios.get(urlInventoryCSGO);
        const responseDOTA = await axios.get(urlInventoryDOTA);
        let map = new Map();
        for (var des in responseCSGO.data.descriptions) {
            if (!map.has(responseCSGO.data.descriptions[des].classid)) {
                map.set(responseCSGO.data.descriptions[des].classid, responseCSGO.data.descriptions[des]);
            }
        }
        for (var des in responseDOTA.data.descriptions) {
            if (!map.has(responseDOTA.data.descriptions[des].classid)) {
                map.set(responseDOTA.data.descriptions[des].classid, responseDOTA.data.descriptions[des]);
            }
        }
        req.inv = {};
        req.inv.csgo = [];
        req.inv.dota = [];
        for (var asset in responseCSGO.data.assets) {
            req.inv.csgo.push(map.get(responseCSGO.data.assets[asset].classid));
        }
        for (var asset in responseDOTA.data.assets) {
            req.inv.dota.push(map.get(responseDOTA.data.assets[asset].classid));
        }
        next();
    }
    catch (err) {
        console.log(err);
        res.redirect("/error500");
    }
};
function replace(str) {
    return str.replace(/ /g, "%20").replace("|", "%7C").replace("(", "%28").replace(")", "%29").replace("™", "%E2%84%A2");
}
module.exports.inventoryValue = async function (req, res, next) {
    createIfAbsent(730);
    createIfAbsent(570);
    try {
        const pathList = __dirname.split("\\");
        pathList.pop();
        // Getting cached csgo item prices
        var csgoPrices = {};
        var pathCSGO = pathList.join("\\") + "\\Cache\\730\\itemPrices.json";
        if (fs.existsSync(pathCSGO)) {
            csgoPrices = JSON.parse(fs.readFileSync(pathCSGO));
        }
        // Getting cached dota item prices
        var dotaPrices = {};
        var pathDOTA = pathList.join("\\") + "\\Cache\\570\\itemPrices.json";
        if (fs.existsSync(pathDOTA)) {
            dotaPrices = JSON.parse(fs.readFileSync(pathDOTA));
        }

        // Usage to sets to reduce the number of calls to same item
        let setCSGO = new Set();
        for (var item in req.inv.csgo) {
            if (req.inv.csgo[item]["marketable"] == 1) {
                setCSGO.add(req.inv.csgo[item]["market_hash_name"]);
            }
        }
        let setDOTA = new Set();
        for (var item in req.inv.dota) {
            if (req.inv.dota[item]["marketable"] == 1) {
                setDOTA.add(req.inv.dota[item]["market_hash_name"]);
            }
        }
        setCSGO = Array.from(setCSGO);
        const resCSGO = [], csgoNames = [];
        const pricesCSGO = new Map();
        for (var itemName in setCSGO) {
            if (setCSGO[itemName] in csgoPrices && csgoPrices[setCSGO[itemName]]["lastUpdate"] + 3600 * 1000 >= Date.now()) {
                pricesCSGO.set(setCSGO[itemName], csgoPrices[setCSGO[itemName]]);
            }
            else {
                var query = replace(setCSGO[itemName]);
                var urlMarket = `https://steamcommunity.com/market/priceoverview/?currency=24&appid=730&market_hash_name=${query}`;
                const priceResponse = axios.get(urlMarket);
                resCSGO.push(priceResponse);
                csgoNames.push(setCSGO[itemName]);
            }
        }
        var indexCSGO = 0;
        const priceCSGO = await Promise.all(resCSGO);
        for (var item in priceCSGO) {
            priceCSGO[item].data.lastUpdate = Date.now();
            pricesCSGO.set(csgoNames[indexCSGO++], priceCSGO[item].data);
        }
        for (var i = 0; i < setCSGO.length; i++) {
            csgoPrices[setCSGO[i]] = pricesCSGO.get(setCSGO[i]);
        }
        // Over writing previous records with new/updated records
        fs.writeFileSync(pathCSGO, JSON.stringify(csgoPrices));
        var valueCSGO = 0.0;
        for (var item in req.inv.csgo) {
            if (req.inv.csgo[item]["marketable"] == 1) {
                var name = req.inv.csgo[item]["market_hash_name"];
                if (csgoPrices[name]["lowest_price"] == undefined)
                    valueCSGO += parseFloat(csgoPrices[name]["median_price"].replace(/,/g, '').split(" ").pop());
                else
                    valueCSGO += parseFloat(csgoPrices[name]["lowest_price"].replace(/,/g, '').split(" ").pop());
            }
        }

        setDOTA = Array.from(setDOTA);
        const resDOTA = [], dotaNames = [];
        const pricesDOTA = new Map();
        for (var itemName in setDOTA) {
            if (setDOTA[itemName] in dotaPrices && dotaPrices[setDOTA[itemName]]["lastUpdate"] + 3600 * 1000 >= Date.now()) {
                pricesDOTA.set(setDOTA[itemName], dotaPrices[setDOTA[itemName]]);
            }
            else {
                var query = replace(setDOTA[itemName]);
                var urlMarket = `https://steamcommunity.com/market/priceoverview/?currency=24&appid=570&market_hash_name=${query}`;
                const priceResponse = axios.get(urlMarket);
                resDOTA.push(priceResponse);
                dotaNames.push(setDOTA[itemName]);
            }
        }
        var indexDOTA = 0;
        const priceDOTA = await Promise.all(resDOTA);
        for (var item in priceDOTA) {
            priceDOTA[item].data.lastUpdate = Date.now();
            pricesDOTA.set(dotaNames[indexDOTA++], priceDOTA[item].data);
        }
        for (var i = 0; i < setDOTA.length; i++) {
            dotaPrices[setDOTA[i]] = pricesDOTA.get(setDOTA[i]);
        }
        fs.writeFileSync(pathDOTA, JSON.stringify(dotaPrices));
        var valueDOTA = 0.0;
        for (var item in req.inv.dota) {
            if (req.inv.dota[item]["marketable"] == 1) {
                var name = req.inv.dota[item]["market_hash_name"];
                if (dotaPrices[name]["lowest_price"] == undefined)
                    valueDOTA += parseFloat(dotaPrices[name]["median_price"].replace(/,/g, '').split(" ").pop());
                else
                    valueDOTA += parseFloat(dotaPrices[name]["lowest_price"].replace(/,/g, '').split(" ").pop());
            }
        }
        req.inv.valueCsgo = "₹ " + valueCSGO.toFixed(2);
        req.inv.valueDota = "₹ " + valueDOTA.toFixed(2);
        req.inv.value = "₹ " + (valueCSGO + valueDOTA).toFixed(2);
        next();
    }
    catch (err) {
        console.log(err);
        res.redirect("/error500");
    }
}

module.exports.scrapper = async function (req, res, next) {
    const pathList = __dirname.split("\\");
    pathList.pop();
    var path = pathList.join("\\") + "\\Cache\\trade-helper\\csgoShop.json";
    const pricesData = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (req.query.page == undefined)
        req.data = pricesData.slice(0, 30);
    else {
        var page = parseInt(req.query.page);
        if (page > 20)
            req.data = pricesData.slice(0, 30);
        else
            req.data = pricesData.slice(30 * (page - 1), 30 * (page));
    }
    next();
};