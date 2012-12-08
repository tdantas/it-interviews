require 'spec_helper'
 
describe PrimeMatrix do


#  x | 2  | 3  | 5  | 7
# ---|-------------------  
#  2 | 4  | 6  | 10 | 14
#  3 | 6  | 9  | 15 | 21
#  5 | 10 | 15 | 25 | 35
#  7 | 14 | 21 | 35 | 49

  it "Should generate the first 4 primers" do
    PrimeMatrix.new(4).primers.should eq([2,3,5,7])
  end

  it "Should generate first 10 primers" do
    PrimeMatrix.new(10).primers.should eq([2, 3, 5, 7, 11, 13, 17, 19, 23, 29])
  end

  it "should generate the first matrix line with 4 values" do
    PrimeMatrix.new(4).first.should eq([4,6,10,14])
  end

  it "should generate matrix with one line" do
    PrimeMatrix.new(1).first.should eq([4])
  end

  it "should generate matrix with no lines when invalid size" do
    PrimeMatrix.new(0).first.should eq([])
  end

end


