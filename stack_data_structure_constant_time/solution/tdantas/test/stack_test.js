var should = require('should')
var Stack = require('../stack')

describe('Stack', function(){
  
  it('should return stack with only the first value', function() {
    var stack = new Stack()
    stack.push(2)
    stack.push(3)
    stack.push(4)
    stack.push(5)
    stack._minStack.should.eql([2,2,2,2])

	});

  it('should create a minStack with values [3,2,2,1]', function() {
    var stack = new Stack()
    stack.push(3)
    stack.push(2)
    stack.push(4)
    stack.push(1)

    stack._minStack.should.eql([3,2,2,1])

  });

  it('should return undefined when the stack is empty', function() {
    var stack = new Stack()
    should.strictEqual(undefined,stack.getMin())
  });

  it('should return the min value', function() {
    var stack = new Stack()
    stack.push(10)
    stack.push(9)
    stack.push(2)
    stack.push(1)

    should.strictEqual(1,stack.getMin())

  });

  it('should not remove the min value when fetch the min', function() {
    var stack = new Stack()
    stack.push(10)
    stack.push(9)
    stack.push(2)
    stack.push(1)

    should.strictEqual(1,stack.getMin())
    should.strictEqual(1,stack.getMin())

  });

  it('should return the new min value when the first one get out of the stack', function() {
    var stack = new Stack()
    stack.push(10)
    stack.push(2) // Second min value
    stack.push(9)  
    stack.push(1) // First min
    stack.pop()

    should.strictEqual(2,stack.getMin())
  
  });

});