def remove_duplicates_of(word)
  word.chars.uniq.join
end

puts remove_duplicates_of("banana")
puts remove_duplicates_of("house")
puts remove_duplicates_of("apple")
