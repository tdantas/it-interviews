var EventsServer    = require('./events-server');
var UsersServer     = require('./users-server');
var UserRepository  = require('./users/repository');
var EventDispatcher = require('./event-dispatcher');

var eventsServer  = EventsServer(9090);
var userServer    = UsersServer(9099);

userServer.on('user', function(socket, id) {
  UserRepository.create(id, socket);
});

userServer.on("disconnect", function(userid) {
  UserRepository.delete(userid);
});

eventsServer.on('event', function(event) {
  EventDispatcher.process(event);
});

UserRepository.on('empty', function() {

  console.log("-----------------------------------------------")
  console.log(" All users disconnected, closing the server");
  console.log("-----------------------------------------------")
  process.exit(0)

});

eventsServer.start(function(err, port) {
  console.log("Events Server started on port: " + port)
});

userServer.start(function(err, port) {
  console.log("User Server accepting data on port: " + port)
});