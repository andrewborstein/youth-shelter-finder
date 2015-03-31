class CreatePhoneUpdaters < ActiveRecord::Migration
  def change
    create_table :phone_updaters do |t|
      t.string :shelter_id
      t.string :phone_number

      t.timestamps null: false
    end
  end
end
