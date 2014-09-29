var assert = require("assert")
var EventQueue  = require('../queue/event-queue')
var Event       = require('../events')
var sinon       = require('sinon')

describe('EventQueue', function() {
  var eventQueue;
  
  beforeEach(function () {
    eventQueue = new EventQueue()
  });

  it("adds events to the queue", function(){
    eventQueue.push(new Event('123|B'))
    eventQueue.push(new Event('123|B'))
    assert.equal(2, eventQueue.length())
  })
  
  it("subtracts events to the queue when event is processed", function(){
    eventQueue.push(new Event('123|B'))
    assert.equal(1, eventQueue.length())
  })

  it("when ordered create a list of elegible events to be processed", function(){
    eventQueue.processEvents = function(){}
    eventQueue.push(new Event('2|B'))
    assert.equal(0, eventQueue.elegibleEvents.length)
    eventQueue.push(new Event('1|B'))
    assert.equal(2, eventQueue.elegibleEvents.length)
  })

  it("increments the sequence when found elegible events", function(){
    assert.equal(1, eventQueue.sequence)
    eventQueue.push(new Event("1|B"))
    assert.equal(2, eventQueue.sequence)
  })


  it("subtracts events to the queue when event is processed", function(){
    eventQueue.push(new Event('2|B'))
    assert.equal(1, eventQueue.length())
    eventQueue.push(new Event('1|B'))
    assert.equal(0, eventQueue.length())
  })


  it("process elegible events when ordered",  sinon.test(function() {
    var last    = new Event('6|B')
    var second  = new Event('2|B')
    var first   = new Event('1|B')
    
    this.mock(second).expects("process").once();
    this.mock(first).expects("process").once();
    this.mock(last).expects("process").never();

    eventQueue.push(second)
    eventQueue.push(last)
    eventQueue.push(first)
  }))

  it("process in the proper order", sinon.test(function(){
    var second  = new Event('2|B')
    var first   = new Event('1|B')
    
    var s = this.mock(second).expects("process").once();
    var f = this.mock(first).expects("process").once();

    eventQueue.push(second)
    eventQueue.push(first)
    sinon.assert.callOrder(f,s)
  }))

})  