What will be the output of the following code?
def check
  begin
    puts "open"
    fail "mess!"
  rescue Exception => e
    puts e
    puts "clean"
  ensure
    puts "close"
  end
end
check