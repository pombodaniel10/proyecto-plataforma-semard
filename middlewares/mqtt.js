var mqtt = require('mqtt');

var client  = mqtt.connect('mqtt://127.0.0.1',{
  port: 1883,
  clientId: "Severo perro pirobo",
  username: "semard",
  password: "semard2017"
});

client.on('connect', function () {
  client.subscribe('outStepper');
});

module.exports = client;
