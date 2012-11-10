var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8000)
app.use(express.static(__dirname + '/static'));

var lobby = [];

io.sockets.on('connection', function(socket){
	socket.on('wantpartner', function(){
		var partner;
		console.log('new guy in the lobby!');
		if (lobby.length) {
			socket.partner = lobby.shift();
			socket.partner.partner = socket;
			socket.emit('foundpartner', { initiate: true }, function(sdp, cb){
				console.log('got an offer stream back', sdp);
				socket.partner.emit('foundpartner', { initiate: false, sdp: sdp });
			});
		} else {
			lobby.push(socket);
		}
	});
	socket.on('tellpartner', function(message) {
		if (!socket.partner) {
			console.error("Socket tried to send a message to its partner but doesn’t have a partner", socket, message);
			return;
		}
		socket.partner.emit('partnermessage', message);
	});

});
