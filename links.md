Steam API Documentation
    https://partner.steamgames.com/doc/webapi
Game acheivements list
-> `http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${steamApi}&appid=${req.params.appid}`
Player owned game
-> `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApi}&steamid=${req.params.userid}`
Player Inventory
-> `http://steamcommunity.com/inventory/${req.params.userid}/${req.params.gameid}/2?l=english&count=5000`;
Get item value
-> `https://steamcommunity.com/market/priceoverview/?currency=24&appid=${req.params.gameid}&market_hash_name=${query}`
market_hash_name - >StatTrak%E2%84%A2%20P250%20%7C%20Steel%20Disruption%20%28Factory%20New%29
the spaces and special characters are converted to %hex_values
 -> Number(str.charCodeAt(n)).toString(16);
currency -> 1:$ , 24:INR

// Steam app images(forum link)
https://gaming.stackexchange.com/questions/359614/is-there-a-way-to-download-the-box-art-for-steam-games

// Images inventory
    https://steamcommunity-a.akamaihd.net/economy/image/<hashcode>