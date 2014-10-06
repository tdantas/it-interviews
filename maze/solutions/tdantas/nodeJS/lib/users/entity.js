
module.exports = User;

function User(id, socket) {
  var _socket     = socket;
  var _id         = parseInt(id);
  var _followers  = { };

  var me = {
    id: _id,
    followers: followers,
    follow: follow,
    removeFollower: removeFollower,
    setFollower: setFollower,
    unfollow: unfollow,
    send: send,
    toString: toString
  };

  return me;

  function followers() {
    return Object.keys(_followers).map(function(indice) {
      return _followers[indice];
    });
  }

  function follow(user) {
    user.setFollower(me);
  }

  function setFollower(user) {
    _followers[user.id] = user;
  }

  function unfollow(user) {
    user.removeFollower(me);
  }

  function removeFollower(user) {
    delete _followers[user.id];
  }

  function send(payload) {
    _socket.write(payload);
  }

  function toString() {
    return [ _id ].join(" ")
  }

}

User.NULL = new User('N/A', { write: noop });
function noop(payload, cb) {
  if(typeof cb === 'function') cb();
}
