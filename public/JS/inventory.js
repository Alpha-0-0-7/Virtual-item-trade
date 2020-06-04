const csgo = document.getElementsByClassName("csgo-div")[0];
const dota = document.getElementsByClassName("dota-div")[0];
const csgoContainer = document.getElementsByClassName("item-containers-csgo")[0];
const dotaContainer = document.getElementsByClassName("item-containers-dota")[0];
const value = document.getElementsByClassName("gameValue")[0];
csgo.addEventListener("click", function (e) {
    this.style["border-bottom"] = "1px solid white";
    dota.style["border-bottom"] = "1px solid transparent";
    csgoContainer.style.display = "flex";
    dotaContainer.style.display = "none";
    var cost = value.getAttribute("csgo");
    value.textContent = `CSGO Inventory Value : ${cost}`;
});
dota.addEventListener("click", function (e) {
    this.style["border-bottom"] = "1px solid white";
    csgo.style["border-bottom"] = "1px solid transparent";
    dotaContainer.style.display = "flex";
    csgoContainer.style.display = "none";
    var cost = value.getAttribute("dota");
    value.textContent = `DOTA Inventory Value : ${cost}`;
});