navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

var video1 = document.getElementById("video1");
var video2 = document.getElementById("video2");
var interval = document.getElementById("interval");

interval.nextSibling.value = interval.value;

interval.addEventListener("input", function(){
    this.nextSibling.value = this.value;
    clearToggle();
    setToggle(this.value);
    });

function setToggle(time){

    time = time || 100;

    var toggle = true;
    window.intervalHandle = setInterval(function(){
    if (toggle) {
    video2.style.display = "none";
    toggle = false;
    } else {
    video2.style.display = "block";
    toggle = true;
    }
},time)
}

function clearToggle(){
    if (window.intervalHandle !== null) {
    clearInterval(window.intervalHandle);
    window.intervalHandle = null;
    }
}
