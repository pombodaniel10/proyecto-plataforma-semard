const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const express = require('express'),
    app = express(),
    http = require('http').Server(app);
const users = require("./routes/users");
const mqtt =  require("./routes/mqttAPI");
const mongodb = require("./middlewares/mongodb");
const wsserver = require("./middlewares/wsserver");

//Port number
const PORT = process.env.PORT || 8080;

http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
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
