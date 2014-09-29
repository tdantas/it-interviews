

module.exports = User;

function User(id, socket) {
  var _socket     = socket;
  var _id         = id;
  var _follow     = { };
  var _followers  = { };

  return {
    id: _id,
    following: following,
    followers: followers,
    follow: follow,
    removeFollower: removeFollower,
    setFollowers: setFollowers,
    unfollow: unfollow,
    send: send,
    toString: toString
  };

  function following() {
    return Object
      .keys(follow)
      .map(mapper);

    function mapper(indice) {
      return follow[indice];
    }
  }

  function followers() {
    return Object
      .keys(_followers)
      .map(mapper);

    function mapper(indice) {
      return _followers[indice];
    }
  }

  function follow(user) {
    follow[user.id] = user;
    setFollowers(this);
  }

  function setFollowers(followerUser) {
    followers[followerUser.id] = followerUser;
  }

  function unfollow(user) {
    delete follow[user.id];
    removeFollower(_id);
  }

  function removeFollower(id) {
    delete _followers[id];
  }

  function send(payload) {
    _socket.write(payload);
  }

  function toString() {
    return [ following(), _id ].join(' -- ');
  }
}

User.NULL = new User('N/A', { write: noop });
function noop(payload, cb) {
  if(typeof cb === 'function') cb();
}

