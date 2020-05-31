const playTimes = document.getElementsByClassName("play-time");
for (var i = 0; i < playTimes.length; i++) {
    var playTime = playTimes[i].textContent;
    var list = playTime.split(".");
    if (list[1] != undefined && list[1].length > 2)
        playTime = list[0] + "." + list[1].substring(0, 2);
    playTimes[i].textContent = playTime + " Hour(s)";
}