"use strict";
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

var viewer = {
	videos: document.getElementById("videos"),
	myCamera: document.getElementById("myCamera"),
	interval: document.getElementById("interval"),

	start: function(stream){
		interval.addEventListener("input", function(){
			interval.nextSibling.value = interval.value;
			this.clearToggle();
			this.setToggle(interval.value);
		}.bind(this));
		this.activeVideo = this.myCamera;
		interval.nextSibling.value = interval.value;
		this.myCamera.src = URL.createObjectURL(stream);
		this.setToggle(interval.value);
	},
	addSource: function(stream) {
		var newVideo = document.createElement('video');
		newVideo.src = URL.createObjectURL(stream);
		newVideo.play();
		newVideo.style.visibility = "hidden";
		this.videos.appendChild(newVideo);
		return newVideo;
	},
	removeSource: function(video) {
		var next = this.nextActiveVideo();
		if (video === next) { next.style.visibility = ""; }
		this.videos.removeChild(video);
	},
	setToggle: function(time){
		this.intervalHandle = setInterval(function(){
			var active = this.activeVideo;
			var next = this.nextActiveVideo();
			if (!next) return;
			next.style.visibility = "";
			active.style.visibility = "hidden";
			this.activeVideo = next;
		}.bind(this), time || 100)
	},
	clearToggle: function(){
		if (this.intervalHandle !== null) {
			clearInterval(this.intervalHandle);
			delete this.intervalHandle;
		}
	},
	nextActiveVideo: function(){
		var active = this.activeVideo;
		var next = active.nextElementSibling;
		if (!next) { next = this.videos.firstElementChild; }
		if (!next || next === active) return;
		return next;
	}
}
