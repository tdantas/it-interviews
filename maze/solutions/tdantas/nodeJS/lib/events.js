var debug = require('debug')('events.processor');

var usersRepository = require('./users/repository');

module.exports = Event;

var Processors = {
  'P': PVTEventProcessor,
  'F': FollowEventProcessor,
  'U': UnfollowEventProcessor,
  'B': BroadcastEventProcessor,
  'S': StatusEventProcessor
};

function Event(payload) {
  var pieces           = payload.split("|");

  var _sequence         = parseInt(pieces[0]);
  var _type             = pieces[1].replace(/\r?\n/, "");
  var _from             = pieces[2];
  var _to               = pieces[3];

  return {
    from: _from,
    to: _to,
    type: _type,
    sequence: _sequence,
    payload: payload,
    process: process,
    toString: toString
  };

  function process(callback) {
    Processors[_type](this, callback);
  }
  
  function toString() {
   return [ 
      'Sequence: ' + _sequence,
      'type: ' + _type,
      'From:' + _from,
      'To: ' + _to
    ].join(" ");
  }
}

function PVTEventProcessor(event, cb) {
  debug('PVTEventProcessor ' + event);
  
  var toUser = usersRepository.fetch(event.to); 
  toUser.send(event.payload);
}

function FollowEventProcessor(event, cb) {
  debug('FollowEventProcessor ' + event);

  var from = usersRepository.fetch(event.from);
  var to   = usersRepository.fetch(event.to);

  from.follow(to);
  to.send(event.payload, cb);
}

function UnfollowEventProcessor(event, cb) {
  debug('UnfollowEventProcessor ' + event);

  var from = usersRepository.fetch(event.from);
  var to = usersRepository.fetch(event.to);
  
  from.unfollow(to);
}

function BroadcastEventProcessor(event, cb) {
  debug('BroadcastEventProcessor ' + event);
  var allUsers  = usersRepository.all();

  allUsers.forEach(function(client) {
    client.send(event.payload, cb);
  });
}

function StatusEventProcessor(event, cb) {
  debug('StatusEventProcessor ' + event);

  var fromUser  = usersRepository.fetch(event.from);

  fromUser.followers().forEach(function(client) {
    client.send(event.payload, cb);
  });
}

