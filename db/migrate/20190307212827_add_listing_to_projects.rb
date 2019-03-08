class AddListingToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :listed, :boolean, :default => true
  end
end
