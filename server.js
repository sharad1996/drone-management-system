var http = require('http');
var Static = require('node-static');
var app = http.createServer(handler);
var _ = require('lodash');
var io = require('socket.io').listen(app);
var port = 8080;

var files = new Static.Server('./public');

function handler(request, response) {
  request.on('end', function () {
    files.serve(request, response);
  }).resume();
}

var droneData = [], central = '', updateData = [];

//start socket programming
io.on('connection', function (socket) {
  
  //create central server
  console.log(socket.id + " " + "connected");

  //send starting geolocation
  socket.on('send', function (data) {
		socket.emit('load', data);
  });
  
  //disconnect drone
  socket.on('disconnect', function () {
    updateData = droneData.filter(d => d.socketId !== socket.id);
    console.log(socket.id + " " + "disconnected");
  });
});

// start app on specified port
app.listen(port);
console.log('Your server goes on localhost:' + port);