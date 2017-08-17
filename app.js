const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({port: 8080});
const WebSocket = require('ws');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Port number
const PORT = 4000;

//WebSocket
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('mqtt message', function(msg){
    io.emit('mqtt message', msg);
    console.log(msg);
  });
});

io.emit('some event', { for: 'everyone' });

http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});

//Connect to database
mongoose.connect(config.database, {
  useMongoClient: true
});

//On connection
mongoose.connection.on('connected', () => {
  console.log("Connected to database "+config.database);
});

//Error connection
mongoose.connection.on('error', (err) => {
  console.log("Database error: "+err);
});


const users = require("./routes/users");
const mqtt =  require("./routes/mqttAPI");



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
