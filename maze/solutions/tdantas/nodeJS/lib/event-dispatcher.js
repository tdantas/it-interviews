module.exports = EventDispatcher();

function EventDispatcher() {
  var next    = 1;
  var backlog = { };

  return { process: process };

  function process(event) {
    var event;
    backlog[event.sequence] = event;

    while(event = backlog[next]) {
      delete backlog[next];
      next++;
      event.process();
    }
  }
}