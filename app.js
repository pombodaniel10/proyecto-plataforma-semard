const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');


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

const app = express();

const users = require("./routes/users");
const mqtt =  require("./routes/mqttAPI");

//Port number
const PORT = 4000;

//Cors Middleware
app.use(cors());

//Set static folder

app.use(express.static(path.join(__dirname,'public')));

//Body Parser MIddleware
app.use(bodyParser.json());

//Passport Middleare
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('dashboard',mqtt);

//Index page
app.get('/', (req,res) => {
  res.send("Invalid endpoint");
});

//Start server
app.listen(PORT, function(){
    console.log("My http server listening on port " + PORT + "...");
});
