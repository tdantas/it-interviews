### Enviroment
###### Language: 
	Javascript    
##### Test Framework / Assertion Library
	Mocha / Should
 
#### Run
	cd tdantas
	node solution.js
	
#### Tests
	cd tdantas
	npm install 
	mocha test/
	
#### Output

````
$ node solution.js
[ ]
[100]
[100 | 200 ]
[100 | 200 | 10 ]
[100 | 200 | 10 | 5 ]

Stack#getMin
 # => 5
Stack#pop
 # => 5
Stack#getMin
 # => 10
Stack#pop
 # => 10
Stack#getMin
 # => 100
Stack#pop
 # => 200
Stack#pop
 # => 100
Stack#pop
 # => undefined

````