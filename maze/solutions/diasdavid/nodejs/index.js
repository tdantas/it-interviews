var tcp = require('net');

tcp.createServer(eventHandler).listen(9090,'127.0.0.1');
tcp.createServer(clientHandler).listen(9099,'127.0.0.1');

var clients = {};
var seqNumber = 1;
var events = [];
var end = false;

function eventHandler(socket) {
  socket.setEncoding('utf8');
  socket.on('data', function(data){
    data.split('\n').map(function(el){
      if(el.length > 1) {
        events.push(el);
      }
      // console.log(data);      
    });
  });

  socket.on('end', function (){
    console.log('end');
    end = true;
  });
}

function clientHandler(socket) {
  socket.setEncoding('utf8');
  socket.on('data', function(data){
    clients[data.trim()] = {
      socket: socket,
      followers: []
    }
  });
}

function munch() {
  while(true) {

    if (end) {
      return process.exit(0); 
    }

    if (events.length < 1) {
      continue;
    }

    var ev = events.shift();

    var evSplit = ev.split('|');
    if (parseInt(evSplit[0]) === seqNumber) {
      // console.log(ev);
      switch(evSplit[1]) {
        case 'F': follow(ev, evSplit); break;
        case 'U': unfollow(ev, evSplit); break;
        case 'B': broadcast(ev, evSplit); break;
        case 'P': privateMessage(ev, evSplit); break;
        case 'S': statusUpdate(ev, evSplit); break;
        // default: console.log('no event type match');
      }
      seqNumber += 1;
    } else {
      events.push(ev);
    }

  }
}

// falta estas funcões 

function follow(ev, evSplit) {
  // evSplit[2] follower
  // evSplit[3] to follow
  // console.log('id: ', evSplit[2]);
  // console.log('id: ', evSplit[3]);
  // console.log('all:', ev, evSplit);  
  if(!clients[evSplit[2]] || !clients[evSplit[3]]) {
    // console.log('does not exist - follow');
    return;
  }

  clients[evSplit[3]].followers.push(evSplit[2]);
  clients[evSplit[3]].socket.write(ev + '\r\n');

}

function unfollow(ev, evSplit) {
  // evSplit[2] follower
  // evSplit[3] to unfollow
  // console.log('ids: ', evSplit[2], evSplit[3]);
  // console.log('all:', ev, evSplit);

  if(!clients[evSplit[2]] || !clients[evSplit[3]]) {
    // console.log('does not exist - unfollow');
    return;
  }

  clients[evSplit[3]]
    .followers
    .remove(
      clients[evSplit[3]].followers.indexOf(evSplit[3])
    );
  
}

function broadcast(ev, evSplit) {
  Object.keys(clients)
    .map(function(key) {
      // console.log('VOU BROADCAST: ', key);
      // console.log(clients[key]);
      // console.log('payload: ',  ev);
      clients[key].socket.write(ev + '\r\n');
    });
}

function privateMessage(ev, evSplit) {
  // evSplit[3] destination
  // console.log('id: ', evSplit[3]);
  // console.log('all:', ev, evSplit);
  if(!clients[evSplit[3]]) {
    // console.log('does not exist - private');
    return;
  }

  clients[evSplit[3]].socket.write(ev + '\r\n');
}

function statusUpdate(ev, evSplit) {

  // evSplit[2] update followers
  // console.log('id: ', evSplit[2]);
  // console.log('all:', ev, evSplit);
  if(!!!clients[evSplit[2]]) {
    // console.log('does not exist - statusUpdate - ', clients[evSplit[2]], evSplit[2]);
    return;
  }

  if(clients[evSplit[2]].followers.length === 0) {
    // console.log('THERE IS : ', clients[evSplit[2]].followers, clients[evSplit[2]].followers.length);
    return;
  }


  clients[evSplit[2]].followers.map(function(flw){
    clients[flw].socket.write(ev + '\r\n');
  });
}

function test() {
  if (events.length > 5) {
    munch();
  } else {
    setTimeout(test,150);
  }
}
test();
 // warmp up

/// helper

// eg. directions.remove(directions.indexOf(previousDirection));

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};