const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

const users = require("./routes/users");

//POrt number
const PORT = 4000;

//Cors Middlewate
app.use(cors());

//Set static folder

app.user(express.static(path.join(__dirname,'public')));

//Body Parser MIddleware
app.use(bodyParser.json());

app.use('/users', users);

app.get('/', (req,res) => {
  res.send("Invalid endpoint");
});

app.listen(PORT, function(){
    console.log("My http server listening on port " + PORT + "...");
});
