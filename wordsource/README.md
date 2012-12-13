== Background

A WordSource is a source of words and it keeps analytical information of each word that it has seen.

== Example

   For the following string: "lorem ipsum ipsum"

   src = LoremIpsumWordSource.new
   src.next_word
     # => "lorem"
   src.next_word
     # => "ipsum"
   src.next_word
     # => "ipsum"
   src.top_5_words
     # => ["ipsum","lorem",nil,nil,nil]
   src.top_5_consonants
     # => ["m","p","s","l","r"]
   src.count
     # => 3 # total words seen

== Assignment

1. Implement LoremIpsumWordSource
2. Get top 5 consonants from the words seen
3. Get top 5 words
4. Add callbacks on specific words e.g. every time "semper" is encountered, call those callbacks registered for "semper"
5. implement a WordSource that uses the twitter API