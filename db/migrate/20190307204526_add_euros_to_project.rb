class AddEurosToProject < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :euros, :float
    add_column :projects, :goal_euros, :float
  end
end
