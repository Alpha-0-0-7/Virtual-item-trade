const nameTag = document.getElementsByClassName("name-tag")[0];
if (nameTag) {
    var name = nameTag.textContent;
    if (name.length > 18)
        nameTag.textContent = name.substring(0, 18) + " ...";
}

const nameClick = document.getElementById("navbarDropdownMenuLink");
if (nameClick) {
    nameClick.nextSibling.style.display = "none";
    nameClick.addEventListener("click", function (e) {
        e.stopPropagation();
        if (this.nextSibling.style.display == "none") {
            this.nextSibling.style.display = "block";
        }
        else {
            this.nextSibling.style.display = "none";
        }
    });
}
window.onclick = function (e) {
    if (this.document.getElementsByClassName("drop-menu")[0])
        this.document.getElementsByClassName("drop-menu")[0].style.display = "none";
}