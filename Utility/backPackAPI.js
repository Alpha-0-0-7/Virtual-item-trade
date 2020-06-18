const fs = require("fs");
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports.updatePrices = async function updatePrices() {
    try {
        const pathList = __dirname.split("\\");
        pathList.pop();
        var path = pathList.join("\\") + "\\Cache\\trade-helper\\items.json";

        const csgoURL = `http://csgobackpack.net/api/GetItemsList/v2/?currency=INR`;
        const csgoItems = await axios.get(csgoURL);

        const dotaURL = `http://dota2.csgobackpack.net/api/GetItemsList/v2/?currency=INR`;
        const dotaItems = await axios.get(dotaURL);

        const data = {};
        for (var name in csgoItems.data["items_list"]) {
            data[name] = csgoItems.data.items_list[name];
        }
        for (var name in dotaItems.data.items_list) {
            data[name] = dotaItems.data.items_list[name];
        }
        fs.writeFileSync(path, JSON.stringify(data));
        csgoShopFetcher();
    }
    catch (err) {
        console.log(err);
    }
};
function replace(str) {
    return str.replace(/ /g, "%20").replace("|", "%7C").replace("(", "%28").replace(")", "%29").replace("™", "%E2%84%A2");
}
async function csgoShopFetcher() {
    try {
        var urlCSGO = 'https://csgoshop.com/730?filters%5Bpmin%5D=.5&filters%5Bpmax%5D=1600.00&filters%5Bsort%5D=discount%3A1&filters%5Bview%5D=1&filters%5Bstat_track%5D=&filters%5Bquality%5D=&filters%5Btype%5D=&filters%5Bweapon%5D=&filters%5Bcollection%5D=&filters%5Bwear_value%5D=&filters%5Bname%5D=&page=';
        var urlDOTA = 'https://csgoshop.com/570?filters%5Bpmin%5D=.5&filters%5Bpmax%5D=1600.00&filters%5Bsort%5D=discount%3A1&filters%5Bview%5D=1&filters%5Bstat_track%5D=&filters%5Bquality%5D=&filters%5Btype%5D=&filters%5Bweapon%5D=&filters%5Bcollection%5D=&filters%5Bwear_value%5D=&filters%5Bname%5D=&page=';

        const pathList = __dirname.split("\\");
        pathList.pop();
        var path = pathList.join("\\") + "\\Cache\\trade-helper\\csgoShop.json";

        const results = [];
        const res1 = await axios.get(urlCSGO + 1);
        results.push(res1);
        const res2 = await axios.get(urlCSGO + 2);
        results.push(res2);
        const res3 = await axios.get(urlCSGO + 3);
        results.push(res3);
        const res4 = await axios.get(urlCSGO + 4);
        results.push(res4);
        const res5 = await axios.get(urlCSGO + 5);
        results.push(res5);
        const res6 = await axios.get(urlCSGO + 6);
        results.push(res6);
        const res7 = await axios.get(urlCSGO + 7);
        results.push(res7);
        const res8 = await axios.get(urlCSGO + 8);
        results.push(res8);
        const res9 = await axios.get(urlCSGO + 9);
        results.push(res9);
        const res10 = await axios.get(urlCSGO + 10);
        results.push(res10);
        // const res11 = await axios.get(urlCSGO + 11);
        // results.push(res11);
        // const res12 = await axios.get(urlCSGO + 12);
        // results.push(res12);
        // const res13 = await axios.get(urlCSGO + 13);
        // results.push(res13);
        // const res14 = await axios.get(urlCSGO + 14);
        // results.push(res14);
        // const res15 = await axios.get(urlCSGO + 15);
        // results.push(res15);
        // const res16 = await axios.get(urlCSGO + 16);
        // results.push(res16);
        // const res17 = await axios.get(urlCSGO + 17);
        // results.push(res17);
        // const res18 = await axios.get(urlCSGO + 18);
        // results.push(res18);
        // const res19 = await axios.get(urlCSGO + 19);
        // results.push(res19);
        // const res20 = await axios.get(urlCSGO + 20);
        // results.push(res20);
        const res21 = await axios.get(urlDOTA + 1);
        results.push(res21);
        const res22 = await axios.get(urlDOTA + 2);
        results.push(res22);
        const res23 = await axios.get(urlDOTA + 3);
        results.push(res23);
        const res24 = await axios.get(urlDOTA + 4);
        results.push(res24);
        const res25 = await axios.get(urlDOTA + 5);
        results.push(res25);
        const res26 = await axios.get(urlDOTA + 6);
        results.push(res26);
        const res27 = await axios.get(urlDOTA + 7);
        results.push(res27);
        const res28 = await axios.get(urlDOTA + 8);
        results.push(res28);
        const res29 = await axios.get(urlDOTA + 9);
        results.push(res29);
        const res30 = await axios.get(urlDOTA + 10);
        results.push(res30);
        // const res31 = await axios.get(urlDOTA + 11);
        // results.push(res31);
        // const res32 = await axios.get(urlDOTA + 12);
        // results.push(res32);
        // const res33 = await axios.get(urlDOTA + 13);
        // results.push(res33);
        // const res34 = await axios.get(urlDOTA + 14);
        // results.push(res34);
        // const res35 = await axios.get(urlDOTA + 15);
        // results.push(res35);
        // const res36 = await axios.get(urlDOTA + 16);
        // results.push(res36);
        // const res37 = await axios.get(urlDOTA + 17);
        // results.push(res37);
        // const res38 = await axios.get(urlDOTA + 18);
        // results.push(res38);
        // const res39 = await axios.get(urlDOTA + 19);
        // results.push(res39);
        // const res40 = await axios.get(urlDOTA + 20);
        // results.push(res40);
        var listItems = [];
        const pricesData = JSON.parse(fs.readFileSync(pathList.join("\\") + "\\Cache\\trade-helper\\items.json", 'utf8'));
        for (var i = 0; i < 20; i++) {
            const dom = new JSDOM(results[i].data);
            const item = dom.window.document.getElementsByClassName("item");
            const prices = dom.window.document.getElementsByClassName("item-price");
            const links = dom.window.document.getElementsByClassName("listing-link");
            const images = dom.window.document.getElementsByClassName("crop-icon");
            var steamLink = 'https://steamcommunity.com/market/listings/';
            for (var j = 0; j < item.length; j++) {
                var name = item[j].getAttribute("title").trim();
                if (pricesData[name] == undefined)
                    continue;
                const itemInfo = pricesData[name]["price"];
                var priceINR = 0, sold = 0;
                if (itemInfo["24_hours"]) {
                    priceINR = itemInfo["24_hours"]["median"];
                    sold = itemInfo["24_hours"]["sold"];
                }
                else if (itemInfo["7_days"]) {
                    priceINR = itemInfo["7_days"]["median"];
                    sold = itemInfo["7_days"]["sold"] / 7;
                }
                else if (itemInfo["30_days"]) {
                    priceINR = itemInfo["30_days"]["median"];
                    sold = itemInfo["30_days"]["sold"] / 30;
                }
                var hashName = replace(name);
                var game = '730';
                if (i >= 10)
                    game = '570';
                var priceTag = prices[j].textContent.trim();
                var index = priceTag.indexOf("$");
                var price = parseFloat(priceTag.substring(index + 1));
                var borderColor = pricesData[name]["rarity_color"];
                var itemObj = {
                    "name": name,
                    "priceTag": priceTag,
                    "shop-link": links[j].getAttribute("href"),
                    "steam-link": steamLink + game + "/" + hashName,
                    "image-link": images[j].firstChild.getAttribute("src"),
                    "border-color": borderColor,
                    "price": price,
                    "sold": Math.round(sold),
                    "priceINR": Math.round(priceINR),
                    "ratio": Math.round(priceINR / price)
                };
                listItems.push(itemObj);
            }
        }
        listItems.sort((a, b) => b.ratio - a.ratio);
        console.log(listItems);
        fs.writeFileSync(path, JSON.stringify(listItems));
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.csgoShopFetcher = csgoShopFetcher;