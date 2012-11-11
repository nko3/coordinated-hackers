"use strict";
window.PeerConnection = window.PeerConnection || window.webkitRTCPeerConnection;

function RTC(socket, stream) {
	this.socket = socket;
	this.stream = stream;
	this.createPeerConnection();
}
RTC.prototype.config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

RTC.prototype.createPeerConnection = function(){
	var peerConnection = new PeerConnection(this.config);
	this.peerConnection = peerConnection;
	peerConnection.onicecandidate = this.tellpartner.bind(this, 'candidate');
	peerConnection.onaddstream = this.onaddstream.bind(this);
	peerConnection.addStream(this.stream);
};
RTC.prototype.tellpartner = function(name, data){ this.socket.emit('tellpartner', {
	to: this.partnerId, data: { name: name, data: data }
}); };
RTC.prototype.onpartnermessage = function(message){
	console.log('message from partner', message);
	switch (message.name) {
	case "candidate":
		if (message.data.candidate) {
			this.peerConnection.addIceCandidate(new RTCIceCandidate(message.data.candidate));
		}
		break;
	case "answer":
		this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.data));
		break;
	default:
		console.warn('unknown message from candidate:', message);
	}
};
RTC.prototype.onpartnerleft = function(){
	viewer.removeSource(this.videoElement);
	this.peerConnection.close();
};
RTC.prototype.onaddstream = function(event) {
	this.videoElement = viewer.addSource(event.stream);
};
RTC.prototype.onfoundpartner = function(msg, cb) {
	console.log('Found partner!', msg);
	this.partnerId = msg.id;
	if (msg.initiate) {
		this.peerConnection.createOffer(
			function(sdp) {
				this.peerConnection.setLocalDescription(sdp);
				cb(sdp);
			}.bind(this), null, { has_video: true }
		);
	} else {
		this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
		this.peerConnection.createAnswer(
			function(sdp) {
				this.peerConnection.setLocalDescription(sdp);
				this.tellpartner('answer', sdp);
			}.bind(this), null, { has_video: true }
		);
	}
};
