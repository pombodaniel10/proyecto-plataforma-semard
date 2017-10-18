/*const WebSocketServer = require('ws').Server;
const server = require('./httpServer').Server;
const wss = new WebSocketServer({'ws:localhost:8080'});


//WebSocket
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

wss.on('connection', function(ws) {
    ws.on('message', function(msg) {
        wss.broadcast(msg);
    });
});

module.exports = wss;
