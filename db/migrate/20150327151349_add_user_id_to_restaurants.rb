class AddUserIdToRestaurants < ActiveRecord::Migration
  def change
    add_column :restaurants, :user_id, :integer
    add_index :restaurants, :user_id
  end
end