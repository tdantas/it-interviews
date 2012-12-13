require 'spec_helper'
describe String do
	
  it "should transform banana in ban" do
	 "banana".del_dup.should eq("ban")
  end

  it "should transform thiago in thiago " do
	 "thiago".del_dup.should eq("thiago")
  end
  
  it "should transform apple in apple " do
	 "aple".del_dup.should eq("aple")
  end

  it "should transform c in c " do
   "c".del_dup.should eq("c")
  end

  it "should transform aaaaa in a " do
   "aaaaa".del_dup.should eq("a")
  end

end