## LRU Cache system
####Which data structures you choose to implement LRU Cache System ?

#### Implement one cache system to validate your idea.

***Cache Interface:***

	get(key) => [ object | null ]

 	save(key, value) => [ old_value | null ]
		if the key exist, returns the last value bounded to with this key
		Otherwise null
