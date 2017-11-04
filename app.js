const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const express = require('express');
const users = require("./routes/users");
const angularFiles = require("./routes/angularFiles");
const mqtt =  require("./routes/mqttAPI");
const mongodb = require("./middlewares/mongodb");

//const webSocket = require("./middlewares/webSocket");

const app = express();
const PORT = process.env.PORT || 8080;
module.exports = PORT;
const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server });

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



app.use(express.static('public'));

//Cors Middleware
app.use(cors());

//Body Parser MIddleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/dashboard',mqtt);
app.use('/',angularFiles)
