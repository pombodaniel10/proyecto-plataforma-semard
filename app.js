const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const users = require("./routes/users");
const mqtt =  require("./routes/mqttAPI");
const mongodb = require("./middlewares/mongodb");

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server });

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

app.use(express.static('public'));

//Cors Middleware
app.use(cors());

//Body Parser MIddleware
app.use(bodyParser.json());

//Passport Middleare
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/dashboard',mqtt);

//Index page
app.get('/', (req,res) => {
  res.send("Invalid endpoint");
});
