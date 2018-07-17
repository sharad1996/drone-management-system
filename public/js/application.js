$(function() {
	// generate unique user id
	var droneId = Math.random().toString(16).substring(2,15);
	var socket = io.connect('https://c161d06b.ngrok.io');
	var infoList = $('#infoList');
	var connects = {}, droneData  = [];
	var option = { enableHighAccuracy: true, maximumAge: Infinity, timeout: Infinity };
	socket.on('connect', function(){
		socket.emit('send', {droneId: droneId});
	})

	socket.on('load', function(data) {
		connects[data.droneId] = data;
		connects[data.droneId].updated = $.now();
	});

	// check whether browser supports geolocation api
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, positionError, option);
	} else {
		console.log('error.............');
	}

	//show only drone data at socket server or browser
	socket.on('show-to-user', function(data) {
		infoList.append("<p class='infolist' > :>" + " " + "DroneId: " + data.droneId + " " + "Latitude: " + data.latitude + 
		" " + "Longitude: " + data.longitude + " " + "speed: " + data.speed + "<br></p>" ).attr('id', data.droneId);
	});

	//show all drone data at central server
	socket.on('show', function(data) {
		infoList.append("<p class='infolist-drone' > :>" + " " + "DroneId: " + data.droneId + " " + "Latitude: " + data.latitude + 
		" " + "Longitude: " + data.longitude + " " + "speed: " + data.speed + "<br></p>").attr('id', data.droneId);
	});


	//tracking function
	function getLocation() {
		navigator.geolocation.watchPosition(matchPosition, positionError, option);
	}

	//highlight drone when its not moving more than 10 sec
	function matchPosition(position) {
		var lat =  position.coords.latitude;
		var lng =  position.coords.longitude;
		var speed =  position.coords.speed;
		var timestamp = position.coords.timestamp;
		var data  = {droneId: droneId, latitude: lat, longitude: lng, speed: speed, timestamp: timestamp};
		droneData.map(d => {
			if(d.droneId === data.droneId && d.latitude === data.latitude && d.longitude === d.longitude){
				$(`#${d.droneId}`).addClass('not-active');
			} else {
				socket.emit('send-update-data', data);
			}
		});
	}

	//show current position of drone 
	function showPosition(position) {
		var lat =  position.coords.latitude;
		var lng =  position.coords.longitude;
		var speed =  position.coords.speed;
		var timestamp = position.coords.timestamp;
		var data  = {droneId: droneId, latitude: lat, longitude: lng, speed: speed, timestamp: timestamp};
		droneData.push(data);
		socket.emit('send-data', data);
	}

	function positionError(error) {
		var errors = {
			1: 'Authorization fails', // permission denied
			2: 'Can\'t detect your location', //position unavailable
			3: 'Connection timeout' // timeout
		};
		showError('Error:' + errors[error.code]);
	}

	//match after 10 sec geolocation
	setInterval(function(){
		getLocation();
	}, 10000);

});
