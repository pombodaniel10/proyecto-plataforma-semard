const WebSocketServer = require('ws').Server;
const port = require('../app');
const wss = new WebSocketServer({ port: port });

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

wss.on('connection', function(ws) {
  //console.log("ws ok");
    ws.on('message', function(msg) {
        wss.broadcast(msg);
    });
});

module.exports = wss;
