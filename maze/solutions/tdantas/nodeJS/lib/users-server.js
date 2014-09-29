var EE  = require('events').EventEmitter;
var net = require('net');

var CRLFParser = require('./parser');

module.exports = UserServer;

function UserServer(port) {
  var ee = new EE();
  var server;

  return {
    start: start,
    stop: stop,
    on: ee.on.bind(ee)
  };

  function start(callback) {
    server = net.createServer(onConnection);
    server.listen(port, function(err) {
      callback(err, port);
    });
  }

  function stop(callback) {
    callback = callback || function(){ }
    server.close(callback);
  }

  function onConnection(userSocket) {
    userSocket._id = +new Date;
    var parser = CRLFParser();

    userSocket.on('data', parser.parse);

    parser.on('token', function(userId) {
      userSocket.userId = userId;
      ee.emit('user', userSocket, userId);
    });

    userSocket.on('close', function onDisconnect() {
      ee.emit('disconnect', userSocket.userId);
    });
  }
}