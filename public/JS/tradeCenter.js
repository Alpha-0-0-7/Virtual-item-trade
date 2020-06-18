const itemNames = document.getElementsByClassName("item-name");
for (var i = 0; i < itemNames.length; i++) {
    if (itemNames[i].textContent.length > 20) {
        itemNames[i].textContent = itemNames[i].textContent.substring(0, 20) + "...";
    }
}