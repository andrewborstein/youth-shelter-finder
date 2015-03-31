class ChangeRestaurantsToShelters < ActiveRecord::Migration
  def change
    rename_table :restaurants, :shelters
  end
end
