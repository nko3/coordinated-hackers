"use strict";

var gif = (function(){
	var exports = {};
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");

	exports.canvas = canvas;
	exports.ctx = ctx;

	var screenshotButton = document.getElementById("screenshot");
	var finishButton = document.getElementById("finishGif");
	var gifContainer = document.getElementById("gifContainer");
	var canvasDataArray = [];
	var workerArray = [
		new Worker("js/animWorker.js"),
		new Worker("js/animWorker.js"),
		new Worker("js/animWorker.js"),
		new Worker("js/animWorker.js")
	];

	screenshotButton.addEventListener("click", screenShot);
	finishButton.addEventListener("click", finishGif);
	interval.addEventListener("input", function(){
		delay = interval.value;
	});

	var delay = 100;
	var animation_parts = [];

	for (var worker in workerArray) {

		workerArray[worker].onmessage = function(e)
		{
			//handle stuff, like get the frame_index
			var frame_index = e.data["frame_index"];
			var frame_data = e.data["frame_data"];
			animation_parts[frame_index] = frame_data;
			for(var j = 0; j < canvasDataArray.length; j++)
			{
				if(animation_parts[j] == null)
				{
					return;
				}
			}
			//check when everything else is done and then do animation_parts.join('') and have fun
			var binary_gif = animation_parts.join('');
			var data_url = 'data:image/gif;base64,'+window.btoa(binary_gif);

			var gifItem = new Image();
			gifItem.src = data_url;
			document.getElementById("gifContainer").appendChild(gifItem);
			canvasDataArray = [];
			animation_parts = [];
		}
	}

	function screenShot() {

        $('video').addClass('highlight')
        setTimeout(function(){
            $('video').removeClass('highlight')
        },1000);

		Array.prototype.forEach.call(document.getElementById('videos').children, function(video) {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			canvasDataArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
		});
	}
	function finishGif() {
		var workerIndex = 0;
		for (var i in canvasDataArray) {
			if (workerIndex >= workerArray.length) workerIndex = 0;
			workerArray[workerIndex].postMessage({"frame_index": +i, "delay": delay, "frame_length":canvasDataArray.length-1, "height":canvas.height, "width":canvas.width, "imageData":canvasDataArray[i].data}); //imarray.join(',')
			workerIndex++;
		}
	}
	canvas.width = 640;
	canvas.height = 480;
	return exports;
})();
