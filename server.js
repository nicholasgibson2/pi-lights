const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var states = {};

var port = parseInt(process.argv[2]);

app.use(express.static('images'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});


io.on('connection', function(socket) {
  for (var light in states) {
    socket.emit('light switch', {name:light, state:states[light]});
  }

  socket.on('light clicked', function(light) {
    if (!(light in states))
      states[light] = 'off';
    states[light] = states[light] == 'off' ? 'on' : 'off';
    io.emit('light switch', {name:light, state:states[light]});
  });
});
