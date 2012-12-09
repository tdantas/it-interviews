var Stack = require('./stack')

console.log("Populating the stack")
console.log("Stack []")
var stack = new Stack()

console.log("[100]")
stack.push(100)

console.log("[100 | 200 ]")
stack.push(200)

console.log("[100 | 200 | 10 ]")
stack.push(10)

console.log("[100 | 200 | 10 | 5 ]")
stack.push(5)


console.log("Stack#getMin")
console.log("# => " + stack.getMin())

console.log("Stack#pop")
console.log("# => " + stack.pop())

console.log("Stack#getMin")
console.log("# => " + stack.getMin())

console.log("Stack#pop")
console.log("# => " + stack.pop())

console.log("Stack#getMin")
console.log("# => " + stack.getMin())

console.log("Stack#pop")
console.log("# => " + stack.pop())

console.log("Stack#pop")
console.log("# => " + stack.pop())

console.log("Stack#pop")
console.log("# => " + stack.pop())