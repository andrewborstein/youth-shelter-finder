class Restaurant < ActiveRecord::Base
  # attributes = name, description, address, phone
  validates :name, presence:true
end
