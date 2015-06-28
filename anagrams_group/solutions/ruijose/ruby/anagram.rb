def anagram_solver(possible_anagrams)
  all_anagrams = possible_anagrams.each_with_object(Hash.new []) do |word, hash| 
    hash[word.chars.sort] += [word]
  end
  print_anagrams(all_anagrams)
end

def print_anagrams(anagrams_hash)
  anagrams_hash.each_with_object([]) do |(key,value), multi_array|
    multi_array << value
  end
end

p anagram_solver(["stars", "mary", "rats", "tars", "army", "banana"])

