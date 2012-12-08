require './line'
require './printer'

class Fixnum
  def prime?
    (2..Math.sqrt(self).to_i).each do |number|
     return false if (self % number == 0)
   end
   true
 end
end

class PrimeMatrix
  attr_accessor :primers, :table
  attr_reader :size

  include Enumerable 

  def initialize(size)
    @size = size
    @primers = []
    populate_primers
  end

  def each(&block)
    return block.call([]) if size == 0

    (0...size).each do |index|
      block.call(Line.new(index, primers).value)
    end
  end

  def print
    self.each do |line|
      Printer.draw(line)
    end
  end


  private
  def populate_primers 
    inc = 2
    until reach_size? do 
      primers << inc if inc.prime?
      inc += 1
    end
  end

  def reach_size?
    primers.size == size 
  end

end