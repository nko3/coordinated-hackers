"use strict";

var gif = (function(){
	var exports = {};
	var encoder = new GIFEncoder();
	exports.encoder = encoder;

	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");

	encoder.setRepeat(0);
	encoder.setDelay(300);
	encoder.setQuality(4);
	encoder.start();

	var screenshotButton = document.getElementById("screenshot");
	var finishButton = document.getElementById("finishGif");
	var gifContainer = document.getElementById("gifContainer");

	screenshotButton.addEventListener("click", screenShot);
	finishButton.addEventListener("click", finishGif);
	interval.addEventListener("input", function(){
		encoder.setDelay(interval.value);
	});

	function screenShot() {
		ctx.drawImage(viewer.video1, 0, 0, viewer.video1.videoWidth, viewer.video1.videoHeight);
		encoder.addFrame(ctx);
		ctx.drawImage(viewer.video2, 0, 0, viewer.video1.videoWidth, viewer.video1.videoHeight);
		encoder.addFrame(ctx);
	}
	function finishGif() {
		encoder.finish();
		var gifOutput = document.createElement("img");
		gifOutput.src = "data:image/gif;base64,"+encode64(encoder.stream().getData());
		gifContainer.appendChild(gifOutput);
		encoder.start();
	}
	canvas.width = 640;
	canvas.height = 480;
	return exports;
})();
