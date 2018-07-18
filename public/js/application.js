$(function() {
	// generate unique user id
	var droneId = Math.random().toString(16).substring(2,15);
	var socket = io.connect('https://40418b94.ngrok.io');
	var infoList = $('#infoList');
	var connects = {}, droneData  = [];
	var options = { enableHighAccuracy: true, maximumAge: Infinity, timeout: Infinity};

	socket.on('connect', function(){
		socket.emit('send', {droneId: droneId});
	})

	socket.on('load', function(data) {
		connects[data.droneId] = data;
		connects[data.droneId].updated = $.now();
	});

	// check whether browser supports geolocation api
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, positionError, options);
	} else {
		console.log('error.............');
	}

	//show only drone data at socket server or browser
	socket.on('show-to-user', function(data) {	
		if ($(`#${data.droneId}`).length) {
			$(`#${data.droneId}`).text(":>" + " " + "DroneId: " + data.droneId + " " + "Latitude: " + data.latitude + " " + "Longitude: " + data.longitude + " " + "speed: " + data.speed);
		}
		else {
			var para1 = $('<p>').attr('id', data.droneId).text(":>" + " " + "DroneId: " + data.droneId + " " + "Latitude: " + data.latitude + " " + "Longitude: " + data.longitude + " " + "speed: " + data.speed);
			infoList.append(para1);
		}
	});

	//show all drone data at central server
	socket.on('show', function(data) {	
		if ($(`#${data.droneId}`).length) {
			$(`#${data.droneId}`).text(":>" + " " + "DroneId: " + data.droneId + " " + "Latitude: " + data.latitude + " " + "Longitude: " + data.longitude + " " + "speed: " + data.speed);
		}
		else {
			var para1 = $('<p>').attr('id', data.droneId).text(":>" + " " + "DroneId: " + data.droneId + " " + "Latitude: " + data.latitude + " " + "Longitude: " + data.longitude + " " + "speed: " + data.speed);
			infoList.append(para1);
		}
	});


	//tracking function
	function getLocation() {
		navigator.geolocation.watchPosition(matchPosition, positionError, options);
	}

	//highlight drone when its not moving more than 10 sec
	function matchPosition(position) {
		var lat =  position.coords.latitude;
		var lng =  position.coords.longitude;
		var speed =  position.coords.speed;
		var data  = {droneId: droneId, latitude: lat, longitude: lng, speed: speed};
		droneData.map(d => {
			if(d.droneId === data.droneId && d.latitude === data.latitude && d.longitude === d.longitude){
				$(`#${data.droneId}`).addClass('not-active');
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
		var data  = {droneId: droneId, latitude: lat, longitude: lng, speed: speed};
		droneData.push(data);
		socket.emit('send-data', data);
	}

		// handle geolocation api errors
		function positionError(error) {
			var errors = {
				1: 'Authorization fails', // permission denied
				2: 'Can\'t detect your location', //position unavailable
				3: 'Connection timeout' // timeout
			};
		}
		
	//match after 10 sec geolocation
	setInterval(function(){
		getLocation();
	}, 10000);

});
