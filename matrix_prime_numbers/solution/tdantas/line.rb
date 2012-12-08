class Line
  attr_accessor :primers
  attr_reader   :factor

  def initialize(index, line)
  	raise "Index Out of Range" unless valid? index, line
    @primers = line
    @factor = primers[index]
  end
  
  def value
    primers.map { |prime| prime * factor }
  end

  private
  def valid?(index, line)
    return false if index < 0
    return true if line.size == 0
    (0...line.size).cover?(index)
  end
  
end