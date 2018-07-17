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

  if(_.isEmpty(droneData)){
    central = socket.id;
  }

  //send starting geolocation
  socket.on('send', function (data) {
		socket.emit('load', data);
  });
  
  //send updated info of all drones
  socket.on('send-data', function (data) {
    const d = {...data, socketId: socket.id}
    socket.emit('show-to-user', data);
    droneData.push(d);
    socket.broadcast.to(central).emit('show', data);
  });

  //send new unmatch updated info of all drones
  socket.on('send-update-data', function (data) {
    socket.emit('show-to-user', data);
    socket.broadcast.to(central).emit('show', data);
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