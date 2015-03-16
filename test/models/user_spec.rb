require './app/models/user.rb'

# describe class and #pass will mean it passed its test
describe User, '#pass' do 
  it "passes test when true" do #actual test
    user = User.new # create instance of user
    grade = user.pass(true) # test the 'pass' function
    expect(grade).to be_truthy # call function, define what we expect
  end
  it "fails test when false" do
    user = User.new # create instance of user
    grade = user.pass(false) # test the 'pass' function
    expect(grade).to be_falsey # call function, define what we expect
  end
end

describe User, '#integration' do 
  it "converts a grade to pass or fail" do 
    user = User.new 
    grade = "C" 
    passed = user.score(grade)
    expect(passed).to be_truthy 
  end
  it "fails test when false" do
    user = User.new # create instance of user
    grade = user.pass(false) # test the 'pass' function
    expect(grade).to be_falsey # call function, define what we expect
  end
end
