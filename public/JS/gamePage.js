// Slide show
const slideImages = document.getElementsByClassName("sc-shot");
const leftArrow = document.getElementsByClassName("left-arrow")[0];
const rightArrow = document.getElementsByClassName("right-arrow")[0];
var pointer = 0;
function makeImageVisible(index) {
    slideImages[index].classList.remove("hidden");
    slideImages[index].classList.add("visible");
}
function hideImage(index) {
    slideImages[index].classList.remove("visible");
    slideImages[index].classList.add("hidden");
}
leftArrow.addEventListener("click", function (e) {
    hideImage(pointer);
    if (pointer == 0)
        pointer = slideImages.length - 1;
    else
        pointer--;
    makeImageVisible(pointer);
});
rightArrow.addEventListener("click", function (e) {
    hideImage(pointer);
    if (pointer == slideImages.length - 1)
        pointer = 0;
    else
        pointer++;
    makeImageVisible(pointer);
})
// Automatic Slideshow
setInterval(function () {
    hideImage(pointer);
    if (pointer == slideImages.length - 1)
        pointer = 0;
    else
        pointer++;
    makeImageVisible(pointer);
}, 15000);

// circle
const scoreContainer = document.getElementsByClassName("score")[0];
if (scoreContainer) {
    var score = parseFloat(scoreContainer.getAttribute("score"));
    if (score <= 50) {
        const svg = document.querySelector("svg");
        const c1 = document.getElementsByClassName("c1")[0];
        const c2 = document.getElementsByClassName("c2")[0];
        var rotationAngle = -90 + (score / 100) * 360;
        svg.style.transform = `rotate(${rotationAngle}deg)`;
        c1.style.stroke = "#5b5b5b";
        c2.style.stroke = "black";
        c2.style["stroke-dasharray"] = `${((100 - score) / 100) * 2 * 3.14 * 40}`;
        c2.style["stroke-width"] = "6px";
    }
}

// System requirements
const systems = document.getElementsByClassName("system-container");
const clickers = document.getElementsByClassName("clicker");
function closeSystemContainers() {
    for (var i = 0; i < systems.length; i++) {
        clickers[i].classList.remove("active");
        clickers[i].classList.add("non-active");
        systems[i].classList.remove("visible-sys");
        systems[i].classList.add("hidden-sys");
    }
}
const windows = document.getElementsByClassName("windows")[0];
if (windows) {
    const windowsContainer = document.getElementsByClassName("windows-container")[0];
    windows.addEventListener("click", function (e) {
        closeSystemContainers();
        windows.classList.remove("non-active");
        windows.classList.add("active");
        windowsContainer.classList.remove("hidden-sys");
        windowsContainer.classList.add("visible-sys");
    });
}
const mac = document.getElementsByClassName("mac")[0];
if (mac) {
    const macContainer = document.getElementsByClassName("mac-container")[0];
    mac.addEventListener("click", function (e) {
        closeSystemContainers();
        mac.classList.remove("non-active");
        mac.classList.add("active");
        macContainer.classList.remove("hidden-sys");
        macContainer.classList.add("visible-sys");
    });
}
const linux = document.getElementsByClassName("linux")[0];
if (linux) {
    const linuxContainer = document.getElementsByClassName("linux-container")[0];
    linux.addEventListener("click", function (e) {
        closeSystemContainers();
        linux.classList.remove("non-active");
        linux.classList.add("active");
        linuxContainer.classList.remove("hidden-sys");
        linuxContainer.classList.add("visible-sys");
    });
}