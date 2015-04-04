require 'test_hepler'
require './app/models/shelter.rb'

# describe class and #pass will mean it passed its test
describe 'shelter' do 
  it "can be editited by admins" do #actual test
    shelter = Shelter.new
    user = User.new
    user.admin = true
    expect(shelter.can_be_editited_by(user)).to be_true
  end
end

end