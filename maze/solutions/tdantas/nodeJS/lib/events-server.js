var EE    = require('events').EventEmitter;
var net   = require('net');

var CRLFParser = require('./parser');
var Events     = require('./events');

module.exports = EventServer;

function EventServer(port) {
  var server;
  var ee      = new EE();
  var parser  = CRLFParser();

  return {
    start: start,
    stop: stop,
    on: ee.on.bind(ee)
  };

  function start(callback) {
    server = net.createServer(onConnection);

    server.listen(port, function(err) {

      parser.on('token', function(rawEvent) {
        var event = Events(rawEvent);
        ee.emit('event', event);
      });

      callback(err, port);
    });

  }

  function stop(callback) {
    callback = callback || function(){ };
    server.close(callback);
  }

  function onConnection(eventStream) {
    eventStream.on('data', parser.parse);
  }
}
