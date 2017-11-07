var client = require("socket.io-client");
var onoff = require("onoff");
var util = require("util");

var host = process.argv[2];
var port = process.argv[3];

var socket = client.connect(util.format("http://%s:%s/", host, port));

console.log("ready to go");

var Gpio = onoff.Gpio,
  nick = new Gpio(17, 'high'),
  pascal = new Gpio(27, 'high');

function light_switch(msg) {
  switch(msg) {
    case 'nick':
      nick.writeSync(nick.readSync() == 0 ? 1 : 0);
      break;
    case 'pascal':
      pascal.writeSync(pascal.readSync() == 0 ? 1 : 0);
      break;
    default:
      break;
  } 
}

socket.on('light switch', function(msg){
  console.debug(msg);
  light_switch(msg)
});

function exit() {
  nick.unexport();
  pascal.unexport();
}

process.on('SIGINT', exit);
