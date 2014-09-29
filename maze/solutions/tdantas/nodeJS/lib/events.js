var usersRepository = require('./users/repository');

module.exports = Event
function Event(payload) {
  var pieces           = payload.split("|");

  var _sequence         = parseInt(pieces[0]);
  var _type             = pieces[1].replace(/\r?\n/, "");
  var _from             = pieces[2];
  var _to               = pieces[3];

  return {
    process: process,
    sequence: _sequence
  };

  function process(callback) {

    var Processors = {
      'P': PVTEventProcessor,
      'F': FollowEventProcessor,
      'U': UnfollowEventProcessor,
      'B': BroadcastEventProcessor,
      'S': StatusEventProcessor
    };

    Processors[_type](callback);
  }

  function PVTEventProcessor(cb) {
    var toUser = usersRepository.fetch(_to)
    toUser.send(payload)
  }

  function FollowEventProcessor(cb) {
    var from = usersRepository.fetch(_from);
    var to   = usersRepository.fetch(_to);

    to.follow(from);
    to.send(payload, cb);
  }

  function UnfollowEventProcessor(cb) {
    var fromUser = usersRepository.fetch(_from);
    var toUser = usersRepository.fetch(_to);
    toUser.unfollow(fromUser, cb);
  }

  function BroadcastEventProcessor(cb) {
    var allUsers  = usersRepository.all();

    allUsers.forEach(function(client) {
      client.send(payload, cb);
    });
  }

  function StatusEventProcessor(cb) {
    var fromUser  = usersRepository.fetch(_from);

    fromUser.followers().forEach(function(client) {
      client.send(payload, cb);
    });
  }
}

