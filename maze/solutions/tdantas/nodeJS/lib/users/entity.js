
module.exports = User;

function User(id, socket) {
  var _socket     = socket;
  var _id         = parseInt(id.replace(/\r?\n/, ""));
  var _follow     = { };
  var _followers  = { };

  var instance = {
    id: _id,
    following: following,
    followers: followers,
    follow: follow,
    removeFollower: removeFollower,
    setFollower: setFollower,
    unfollow: unfollow,
    send: send,
    toString: toString
  };

  return instance;

  function following() {
    return Object
      .keys(_follow)
      .map(mapper);

    function mapper(indice) {
      return _follow[indice];
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
    _follow[user.id] = user;
    user.setFollower(instance);
  }

  function setFollower(user) {
    _followers[user.id] = user;
  }

  function unfollow(user) {
    delete _follow[user.id];
    user.removeFollower(instance);
  }

  function removeFollower(user) {
    delete _followers[user.id];
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


if(require.main == module) {
  thiago = new User('thiago', 'socket');
  lucas  =new User('lucas',   'socket');
  flavia = new User('flavia', 'scoket');
  
  thiago.follow(lucas)
  lucas.follow(flavia)
 

  function ids(collection) {
   return collection.map(function(item) { return item.id });
  }

  
  function report() {
    console.log('Thiago: Following ->', ids(thiago.following()), '| Followers -> ', ids(thiago.followers()))
    console.log('Lucas: Following ->', ids(lucas.following()), '| Followers -> ', ids(lucas.followers()))
    console.log('Flavia: Following ->', ids(flavia.following()), '| Followers -> ', ids(flavia.followers()))
  }

  report();
  console.log('---------- Thiago UNFOLLOW Lucas -----------');
  thiago.unfollow(lucas);
  report();

  console.log('---------- Lucas UNFOLLOW Flavia -----------');

  lucas.unfollow(flavia);
  report();
}

