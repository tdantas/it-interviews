module.exports = EventDispatcher();

function EventDispatcher() {
  var next    = 1;
  var backlog = { };
  var report  = [];

  return { process: process };

  function process(event) {
    var curr;
    backlog[event.sequence] = event;
    
    while((curr = backlog[next])) {
      delete backlog[next];
      next++;

      curr.process();
    }
  }
}
