class CreateUpdates < ActiveRecord::Migration[5.2]
  def change
    create_table :updates do |t|
      t.integer :project_id
      t.string :title
      t.string :time_ago
      t.text :update_html
      t.text :update_text
      t.integer :links
      t.integer :flesch_reading_ease
      t.integer :dale_chall_readability_score
      t.integer :smog_index
      t.integer :difficult_words
      t.integer :word_count
      t.float :textmood_score
      t.float :sentimental_score
      t.text :sentiment

      t.timestamps
    end
    add_index :updates, :project_id
  end
end
