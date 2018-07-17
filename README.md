# Drone-management
A drone management system is use to track the location of every drone in real-time. The system's dashboard will only display the last location of the drones.

Each drone should be associated with a unique identifier, and should report its geo-location coordinates to the central server in real-time.

The dashboard should be a simple single-page application displaying the list of active drones, by their unique identifiers, along with their current speed. You should visually highlight the drones that have not been moving for more than 10 seconds.


# Technology used by system
# Nodejs:
The Node run-time environment includes everything you need to execute a program written in JavaScript.

Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.

# Socketjs:
Socket.io basically works by emitting information from one client of the server to the server, then the server emits that information to the rest of the clients.

All of the clients can emit events to the server, and the server will relay whatever events are received to the rest of the clients.


# How to run
First clone the repsitory from github:

cd drone-management

After that install required packages run ;
npm install

For run this application use:
node server.js

open browser and run : localhost:8080

For making server to your system i use ngrok:
./ngrok http 8080

Replace ngrok https url at application.js file line 4 for running your application as central server. 


# Requirements

- Mac OS X, Linux, Windows;
- It's tested to run with node v8.11.1 or latest;

