var mqtt = require('mqtt');

var client  = mqtt.connect('mqtt://192.168.0.200',{
  port: 1883,
  clientId: "Severo perro pirobo",
  username: "semard",
  password: "semard2017"
});

client.on('connect', function () {
});

module.exports = client;
