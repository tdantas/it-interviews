require_relative "../telegram_problem"

describe Telegram do
  it 'should return 3 word for the next line' do
    Telegram.new(10, "tes1 a car ce cococo").output_lines.should eq(["tes1 a car ce"])
  end

  it 'should return 3 word for each line' do
    Telegram.new(10, "ts1sssssk a car cenaspasd cococo", "ola cca c asd").output_lines.should eq(["ts1sssssk a", "ola cca c asd"])
  end

  it 'should return 1 word for the next line' do
    Telegram.new(5, "tes1 a car cenaspasd cococo").output_lines.should eq(["tes1 a"])
  end

  it 'should return the whole line' do
    Telegram.new(50, "tes1 a car cenaspasd cococo").output_lines.should eq(["tes1 a car cenaspasd cococo"])
  end

  it 'should return stuff' do
    Telegram.new(5, "oi 2i o1").output_lines.should eq(["oi 2i"])
  end
end
