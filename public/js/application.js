$(function() {
	// generate unique user id
	var droneId = Math.random().toString(16).substring(2,15);
	var socket = io.connect('https://0f2eb84d.ngrok.io');
	var infoList = $('#infoList');
	var connects = {}, droneData  = [];

	socket.on('connect', function(){
		socket.emit('send', {droneId: droneId});
	})

	socket.on('load', function(data) {
		connects[data.droneId] = data;
		connects[data.droneId].updated = $.now();
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		console.log('error.............');
	}

	//show current position of drone 
	function showPosition(position) {
		var lat =  position.coords.latitude;
		var lng =  position.coords.longitude;
		var speed =  position.coords.speed;
		var data  = {droneId: droneId, latitude: lat, longitude: lng, speed: speed};
		droneData.push(data);
		socket.emit('send-data', {droneId: droneId, latitude: lat, longitude: lng, speed: speed});
	}

});
