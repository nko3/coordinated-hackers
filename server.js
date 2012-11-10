var http = require('http');
var express = require('express');
var fs = require('fs');
// Hax
var clientJS = __dirname + '/node_modules/webrtc.io-client/lib/webrtc.io.js';
var app = express();

app.use(express.static(__dirname + '/static'));
app.get('/webrtc.io.js', function(req, res){ res.sendfile(clientJS); });

app.listen(8000);
