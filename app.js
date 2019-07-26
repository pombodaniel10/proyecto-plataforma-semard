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
const PORT = process.env.PORT || 4040;
const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const httpserver = module.exports = server;

const wss = require("./middlewares/ws");

wss.broadcast();

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