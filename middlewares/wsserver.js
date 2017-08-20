const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({port: 8080});

//WebSocket
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

wss.on('connection', function(ws) {
    console.log("ws server ok");
    ws.on('message', function(msg) {
        wss.broadcast(msg);
    });
});

module.exports = wss;
