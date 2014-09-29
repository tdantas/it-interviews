var usersRepository = require('./users/repository');

module.exports = Event

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
    process: process
  };

  function process(callback) {
    Processors[_type](this, callback);
  }
}

function PVTEventProcessor(event, cb) {
  var toUser = usersRepository.fetch(event.to)
  toUser.send(event.payload)
}

function FollowEventProcessor(event, cb) {
  var from = usersRepository.fetch(event.from);
  var to   = usersRepository.fetch(event.to);

  to.follow(from);
  to.send(event.payload, cb);
}

function UnfollowEventProcessor(event, cb) {
  var fromUser = usersRepository.fetch(event.from);
  var toUser = usersRepository.fetch(event.to);
  toUser.unfollow(fromUser, cb);
}

function BroadcastEventProcessor(event, cb) {
  var allUsers  = usersRepository.all();

  allUsers.forEach(function(client) {
    client.send(event.payload, cb);
  });
}

function StatusEventProcessor(event, cb) {
  var fromUser  = usersRepository.fetch(event.from);

  fromUser.followers().forEach(function(client) {
    client.send(event.payload, cb);
  });
}

