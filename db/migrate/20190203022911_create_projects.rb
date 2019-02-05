class CreateProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :projects do |t|
      t.string :name
      t.string :profile
      t.string :category
      t.string :location
      t.string :title
      t.string :image
      t.string :youtube
      t.string :vimeo
      t.integer :images
      t.integer :shares
      t.float :amount
      t.float :goal
      t.float :pounds
      t.float :goal_pounds
      t.integer :backers
      t.integer :days
      t.string :time
      t.boolean :trending
      t.boolean :english
      t.text :story_text
      t.text :story_html
      t.integer :links
      t.integer :flesch_reading_ease
      t.integer :dale_chall_readability_score
      t.integer :smog_index
      t.integer :difficult_words
      t.integer :word_count
      t.float :textmood_score
      t.float :sentimental_score
      t.text :sentiment
      t.integer :updates_count
      t.datetime :created_at
      t.integer :fb_shares

      t.timestamps
    end
  end
end
