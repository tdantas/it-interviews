class Telegram
  def initialize(chars_limit, *lines_of_text)
    @chars_limit = chars_limit
    @lines_of_text = lines_of_text
  end

  def output_lines
    @lines_of_text.each_with_object([]) do |line, result|
      if line.length <= @chars_limit
        result << line
      else
        allowed_words = verify_words(count_lines(line))
        result << line.split[0..allowed_words-1].join(" ")
      end
    end
  end

  private 
  def count_lines(line)
    line.split.each_with_object(Hash.new) do |word, hash|
      hash[word] = word.length
    end 
  end

  def verify_words(hash)
    n = 0
    hash.reduce(0) do |result, (key,value)|
      n += value
      result += 1 if n <= @chars_limit
      result
    end
  end
end



