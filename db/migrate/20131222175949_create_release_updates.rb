class CreateReleaseUpdates < ActiveRecord::Migration
  def change
    create_table :release_updates do |t|
      t.string :info
      t.boolean :status, :default => true
      t.timestamps
    end
  end
end
