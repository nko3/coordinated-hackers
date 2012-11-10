var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.static(__dirname + '/static'));

app.listen(8000);
