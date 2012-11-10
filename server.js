var express = require('express');
var app = express();

// spin up server
app.listen(8000, '127.0.0.1')

app.use(express.static(__dirname + '/static'));
