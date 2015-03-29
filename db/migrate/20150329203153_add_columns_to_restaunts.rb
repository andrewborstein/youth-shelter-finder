class AddColumnsToRestaunts < ActiveRecord::Migration
  def change
            add_column :restaurants, :gender, :string   
            add_column :restaurants, :free_bed, :integer
  end
end
