def ranges(list_of_numbers)
  max_number = list_of_numbers.length
  (0..max_number).each_with_object([]) { |_, result|  
    (0...max_number).each do |i|
      (i...max_number).each do |j|
        max_sum = 0
        current_sum = list_of_numbers[i..j].inject(:+)
        if current_sum > max_sum
          max_sum = current_sum
          result << max_sum
        end
      end
    end
  }.max
end


  

