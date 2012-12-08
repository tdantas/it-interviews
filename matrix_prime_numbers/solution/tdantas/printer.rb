class Printer
  def self.draw(line)
    line.each do |element|
      print align(element.to_s, 4) + " |"
    end
    print "\n"
  end

  def self.align(str, alignment)
  	ssize = str.size
  	return str.to_s if ssize >= alignment
  	[str, Array.new(alignment - ssize).join(" ")].join("")
  end

end
