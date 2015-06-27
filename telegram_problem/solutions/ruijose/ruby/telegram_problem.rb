class Telegram
  def initialize(chars_limit, *lines_of_text)
    @chars_limit = chars_limit
    @lines_of_text = lines_of_text
  end

  def output_lines
    available_lines = []
    @lines_of_text.each do |line|
      if line.length <= @chars_limit
        available_lines << line
      else
        allowed_lines = verify_words(count_lines(line))
        available_lines << line.split[0..allowed_lines-1].join(" ")
      end
    end
    return available_lines
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



