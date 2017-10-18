const WebSocketServer = require('ws').Server;
const server = require('../app');
const wss = new WebSocketServer({server});


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
