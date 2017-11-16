const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const express = require('express');

const users = require("./routes/usersAPI");
const angularFiles = require("./routes/angularFiles");
const dashboardAPI =  require("./routes/dashboardAPI");

const mongodb = require("./middlewares/mongodb");

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

function broadcastWSMessage(){
  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
      // Broadcast to everyone else.
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });
  });
}

broadcastWSMessage();

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
app.use('/dashboard',dashboardAPI);
app.use('/',angularFiles);
