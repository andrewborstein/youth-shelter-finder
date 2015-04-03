class AddOwnerToUser < ActiveRecord::Migration
  def change
    add_column :users, :owner, :boolean
  end
end
