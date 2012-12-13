class String

  def del_dup
    flag = Hash[split(//).zip(Array.new(size,0))]
    result = []
    each_char do |c|
      if flag[c] == 0 
        flag[c] += 1 
        result << c
       end
    end
    result.join
  end

end