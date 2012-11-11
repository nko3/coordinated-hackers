"use strict";
window.PeerConnection = window.PeerConnection || window.webkitRTCPeerConnection;

window.rtc = {
	config: {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]},
	start: function(stream){
		this.stream = stream;
		this.socket = io.connect();
		this.socket.on('connect', function(){
			this.createPeerConnection();
			this.socket.emit('wantpartner');
		}.bind(this));
		this.socket.on('foundpartner', this.onfoundpartner.bind(this));
		this.socket.on('partnermessage', this.onpartnermessage.bind(this));
		this.socket.on('partnerleft', this.onpartnerleft.bind(this));
	},
	createPeerConnection: function(){
		// XXX this may not take a function argument anymore
		var peerConnection = new PeerConnection(this.config);
		this.peerConnection = peerConnection;
		peerConnection.onicecandidate = this.tellpartner.bind(this, 'candidate');
		peerConnection.onaddstream = this.onaddstream.bind(this);
		peerConnection.addStream(this.stream);
	},
	tellpartner: function(name, data){ this.socket.emit('tellpartner', {
		name: name, data: data
	}); },
	onpartnermessage: function(message){
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
	},
	onpartnerleft: function(){
		viewer.setOtherSource(null);
		this.peerConnection.close();
		this.createPeerConnection();
		this.socket.emit('wantpartner');
	},
	onaddstream: function(event) { viewer.setOtherSource(event.stream); },
	onfoundpartner: function(msg, cb) {
		console.log('Found partner!', msg);
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
	}
};
