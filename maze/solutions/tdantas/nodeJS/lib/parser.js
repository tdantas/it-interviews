var EE  = require('events').EventEmitter;

module.exports = Parser;

function Parser(matcher) {
  var ee  = new EE();
  var buf = '';
  matcher = matcher || /\r?\n/;

  return {
    parse: toParse,
    on: ee.on.bind(ee)
  };

  function toParse(data) {
    var pieces = (buf + data.toString()).split(matcher)

    buf = pieces.pop();
    for (var i = 0; i < pieces.length; i++) {
      ee.emit('token', pieces[i] + '\n');
    }
  }
}



