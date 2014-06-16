require 'spec_helper'

describe Line do
   describe "method#value" do

    it "should generate a new line based in the index" do
      line = Line.new 0, [2,3,4,5]
      line.value.should eq([4,6,8,10])

      line = Line.new 1, [2,3,4,5]
      line.value.should eq([6,9,12,15])

      line = Line.new 2, [2,3,4,5]
      line.value.should eq([8,12,16,20])

      line = Line.new 3, [2,3,4,5]
      line.value.should eq([10,15,20,25])
   end

    it "should raise one exception when initialize with invalid index" do
      expect { Line.new 2, [2,3] }.to raise_error
   end

    it "should raise one exception when initialize with out of range index" do
      expect { Line.new -1, [3,4] }.to raise_error
   end

    it "should generate a line with no elements when primers is empty" do
      Line.new(0, []).value.should eq([])
      Line.new(10, []).value.should eq([])
   end

  end
end