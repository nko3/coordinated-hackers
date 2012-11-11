var client = {
	start: function(stream) {
		this.socket = io.connect();
		this.stream = stream;
		this.rtcs = {};
		this.socket.on('foundpartner', this.onfoundpartner.bind(this));
		this.socket.on('partnermessage', this.dispatch('onpartnermessage').bind(this));
		this.socket.on('partnerleft', this.dispatch('onpartnerleft').bind(this));
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
