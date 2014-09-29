module.exports = EventDispatcher();

function EventDispatcher() {
  var next    = 1;
  var backlog = { };

  return { process: process };

  function process(event) {
    var currEvent;
    backlog[event.sequence] = event;

    while(currEvent = backlog[next]) {
      delete backlog[next];
      next++;
      currEvent.process();
    }
  }
}