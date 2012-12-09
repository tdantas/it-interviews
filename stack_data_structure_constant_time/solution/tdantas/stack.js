module.exports = MinStack

function MinStack() {
	this._stack = []
	this._minStack = []	
}

MinStack.prototype.push = function(newItem) {
  var minItem = newItem
  if( this.getMin() < newItem  )	minItem = this.getMin()

  this._minStack.push(minItem) 
  this._stack.push(newItem)
}

MinStack.prototype.pop = function() {
  this._minStack.pop()
	return this._stack.pop()
}

MinStack.prototype.getMin = function() {
  var head = this._minStack.length - 1
  return this._minStack[head]
}