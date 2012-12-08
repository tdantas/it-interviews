Suppose you have to implement a system to give suggestions for words based on sequences of digits. 

Think of [T9][wikipedia_t9] where each digit maps to some characters. 

Your job will be to implement 2 functions:

   		void PreProcess(Map<string, double> map)
   		List<string> GetSuggestions(List<int> sequence)

**PreProcess** is called once at the beginning of the program, its parameter is a map of string to probability, i.e. what's the probability of that word show up if the integer sequence that maps to that word is input.

**GetSuggestions** returns the 5 words with the highest probability for a particular integer sequence. 
   
   Don't worry about optimizing PreProcess, just think about data structures and how your decisions will affect the implementation of both functions.
   
   
  [wikipedia_t9]: http://en.wikipedia.org/wiki/T9_(predictive_text 