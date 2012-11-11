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

        $('video').addClass('highlight')
        setTimeout(function(){
            $('video').removeClass('highlight')
        },1000);

		Array.prototype.forEach.call(document.getElementById('videos').children, function(video) {
			ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
			encoder.addFrame(ctx);
		});
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
