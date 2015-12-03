require_relative "max_sum"

describe 'max sum integers' do
  it "should return 21" do
    expect(ranges([1,2,3,4,5,6])).to eql(21)
  end

  it "should return 8" do
    expect(ranges([-10, 2, 3, -2, 0, 5, -15])).to eql(8)
  end

  it "should return 6" do
    expect(ranges([-2, 1, -3, 4, -1, 2, 1, -5, 4])).to eql(6)
  end
  
  it "should return 12" do
    expect(ranges([10, -7, 8, -8, 6, -3, 6, -21, 5, -2, 1])).to eql(12)
  end
end
