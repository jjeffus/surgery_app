class RenameLinksToLinkCount < ActiveRecord::Migration[5.2]
  def change
    rename_column :projects, :links, :link_count
    rename_column :updates, :links, :link_count
  end
end
