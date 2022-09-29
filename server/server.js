var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = 9001;
server.listen(port, function () {
    console.log('[dev]', 'server runs on port ' + port);
});

console.log('[dev]', 'serve frontend and libs');
app.use(express.static(__dirname + '/../src'));
app.use('/libs', express.static(__dirname + '/../node_modules'));
