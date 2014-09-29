var EE    = require('events').EventEmitter;
var net   = require('net');

var CRLFParser = require('./parser');
var Events     = require('./events');

module.exports = EventServer;

function EventServer(port) {
  var server;
  var port    = port;
  var ee      = new EE();
  var parser  = CRLFParser();

  ee.start    = start;
  ee.stop     = stop;

  return ee;

  function start(callback) {
    if(server) return callback('Already Initialized');

    server = net.createServer(onConnection).listen(port, listenCb);

    function listenCb(err) {
      if(err) {
        server = null;
        return callback(err);
      }

      parser.on('token', function(rawEvent) {
        var event = Events(rawEvent);
        ee.emit('event', event);
      });

      return callback(null, port);
    }
  }

  function stop(callback) {
    if(!server) return callback();
    server.close(callback);
  }

  function onConnection(eventStream) {
    eventStream.on('data', parser.parse);
  }
}