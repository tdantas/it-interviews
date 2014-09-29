var assert = require("assert")
var OrderedQueue  = require('../queue/ordered-queue').OrderedQueue
var Node          = require('../queue/ordered-queue').Node

describe('OrderedQueue', function(){
  var orderedQueue = new OrderedQueue()
  
  beforeEach(function(){
    orderedQueue.clear()
  })

  describe('queue length', function() {
    it('increments when initialized with Nodes', function(){
      var queue = new OrderedQueue(Node(2,'2'), Node(3,'3'))
      assert.equal(2, queue.length)
    })
  })

  it('insert ordered', function(){
    var queue = new OrderedQueue(Node(9,'9'), Node(5,'5'), Node(3,'3'))
    var sequences = queue.sequences()
    assert.deepEqual(sequences, [3,5,9])
  })

  it('inserts ordered', function(){
    var queue = new OrderedQueue(Node(9,'9'), Node(5,'5'), Node(3,'3'))
    var sequences = queue.sequences()
    assert.deepEqual(sequences, [3,5,9])
  })

  it('increments the length', function(){
    var queue = new OrderedQueue(Node(9,'9'), Node(5,'5'), Node(3,'3'))
    assert.equal(queue.length, 3)
  })

  describe("#add", function(){
    it('adds ordered', function(){
      var queue = new OrderedQueue(Node(9,'9'))
      queue.add(Node(3,'3'))
      queue.add(Node(5,'5'))
      assert.deepEqual(queue.sequences(),[3,5,9])
    })
  })


  it('pops decrements the length', function(){
    var queue = new OrderedQueue(Node(9,'9'), Node(5,'5'), Node(3,'3'))
    assert.deepEqual(3, queue.length)
    queue.pop(); queue.pop()
    assert.deepEqual(1, queue.length)
  })

  it('pops remove the first', function(){
    var queue = new OrderedQueue(Node(9,'9'), Node(5,'5'), Node(3,'3'))
    queue.pop(); queue.pop()
    assert.deepEqual(queue.sequences(), [9])
  })

  it("returns null when pop empty queue", function(){
    var queue = new OrderedQueue()
    assert.equal(null, queue.pop())
  })

  it("does not decrement when queue is empty", function(){
    var queue = new OrderedQueue()
    queue.pop();
    assert.deepEqual(queue.length, 0)
  })

  it("returns null when there is no more nodes to be poped", function(){
    var queue = new OrderedQueue()
    assert.deepEqual(queue.pop(), null)
  })
  
  it("does not set negative length", function(){
    var queue = new OrderedQueue(Node(9,'9'))
    queue.pop();queue.pop()
    assert.deepEqual(queue.length, 0)
  })

  it("reset the interval queue's internal variable", function(){
    var node = Node(9,'9')
    var queue = new OrderedQueue(node)
    assert.deepEqual(queue.length, 1)
    assert.deepEqual(queue.first, node)
    queue.clear()
    assert.deepEqual(queue.length, 0)
    assert.deepEqual(queue.first, null)
  })

})