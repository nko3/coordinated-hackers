express = require 'express'
app = express()
server = (require 'http').createServer app
io = (require 'socket.io').listen server

server.listen 8000
app.use express.static __dirname + '/static'

class Client
	constructor: (@socket) ->
		socket.on 'tellpartner', (message) =>
			@room.tell @, message.to, message.data

		socket.on 'disconnect', () =>
			@room.disconnect @

	introduce: (partner) ->
		# The below callback should just defer(sdp).
		# https://github.com/maxtaco/coffee-script/issues/44
		await @socket.emit 'foundpartner', { initiate: true, id: partner.socket.id }, ((cb) -> (sdp) -> cb(sdp))(defer(sdp))
		partner.socket.emit 'foundpartner', { initiate: false, id: @socket.id, sdp: sdp }

class Room
	constructor: () -> @members = {}

	join: (newMember) ->
		newMember.room = @
		for id, member of @members
			newMember.introduce member
		@members[newMember.socket.id] = newMember

	tell: (from, to, data) ->
		if to !of @members
			console.error "Client " + from.socket.id + " tried to send a message to " + to + ", who isn’t connected"
			return
		@members[to].socket.emit 'partnermessage', { from: from.socket.id, data: data }

	disconnect: (departingMember) ->
		delete @members[departingMember.socket.id]
		for id, member of @members
			member.socket.emit 'partnerleft', { from: departingMember.socket.id }


mainRoom = new Room

io.sockets.on 'connection', (socket) ->
	mainRoom.join new Client socket

