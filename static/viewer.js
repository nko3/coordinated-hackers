"use strict";
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

var viewer = {
	video1: document.getElementById("video1"),
	video2: document.getElementById("video2"),
	interval: document.getElementById("interval"),

	start: function(stream){
		var streamURL = URL.createObjectURL(stream);
		interval.addEventListener("input", function(){
			interval.nextSibling.value = interval.value;
			this.clearToggle();
			this.setToggle(interval.value);
		}.bind(this));
		interval.nextSibling.value = interval.value;
		this.video1.src = streamURL;
		this.setToggle(50);
	},
	setOtherSource: function(stream) {
		if (stream) {
			this.video2.src = URL.createObjectURL(stream);
		} else {
			this.video2.src = '';
		}
	},
	setToggle: function(time){
		var toggle = true;
		this.intervalHandle = setInterval(function(){
			if (toggle) {
				this.video2.style.display = "none";
				toggle = false;
			} else {
				this.video2.style.display = "block";
				toggle = true;
			}
		}.bind(this), time || 100)
	},
	clearToggle: function(){
		if (this.intervalHandle !== null) {
			clearInterval(this.intervalHandle);
			delete this.intervalHandle;
		}
	}
}
