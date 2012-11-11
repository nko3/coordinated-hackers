var modface = {
	init: function(withStrangers) {
		var videoInput = document.getElementById('myCamera');
		var canvasInput = document.getElementById('faceDetect_canvas');
		this.withAttractiveStrangers = withStrangers;
		faceDetection.init(videoInput,canvasInput);
	},
	start: function(stream) {
		var mirrorVideo;
		if (this.withAttractiveStrangers) {
			this.socket = io.connect();
			this.stream = stream;
			this.rtcs = {};
			this.socket.on('foundpartner', this.onfoundpartner.bind(this));
			this.socket.on('partnermessage', this.dispatch('onpartnermessage').bind(this));
			this.socket.on('partnerleft', this.dispatch('onpartnerleft').bind(this));
		} else {
			mirrorVideo = viewer.addSource(stream);
			mirrorVideo.style.webkitTransform = 'rotate3d(0, 0, 0, 0)';
			mirrorVideo.setAttribute('data-flipped', 'data-flipped');
		}
	},
	onfoundpartner: function(msg, cb) {
		var rtc = new RTC(this.socket, this.stream);
		this.rtcs[msg.id] = rtc;
		rtc.onfoundpartner(msg, cb);
	},
	dispatch: function(name) {
		return function(msg, cb) { this.rtcs[msg.from][name](msg.data, cb); };
	},
    setBoundingBox: function(coords){
        //coords is a dictionary with left, top, width, height fields
        //it is called on each frame where the bounding box of the face is calculated
    }
};

startByYourself.addEventListener('click', function(){
    $('#myModal').modal('hide')
    $('#population').html('You!')
	modface.init(false);
}, false);
startWithOthers.addEventListener('click', function(){
    $('#myModal').modal('hide')
	modface.init(true);
}, false);
