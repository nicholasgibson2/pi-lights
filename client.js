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

var lights = {'nick':nick,'pascal':pascal};
var states = {'on':0,'off':1};

function light_switch(light) {
  if (light.name in lights)
    lights[light.name].writeSync(states[light.state]);
  else
    console.debug('undefined light: ' + JSON.stringify(light));
}

socket.on('light switch', function(light){
  light_switch(light)
});

function exit() {
  nick.unexport();
  pascal.unexport();
}

process.on('SIGINT', exit);
