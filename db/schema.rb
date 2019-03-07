# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_03_07_204823) do

  create_table "projects", force: :cascade do |t|
    t.string "gofundme_key"
    t.string "gofundme_category"
    t.boolean "completed", default: false
    t.string "title"
    t.string "name"
    t.string "profile"
    t.string "location"
    t.string "image"
    t.string "youtube"
    t.string "vimeo"
    t.integer "images"
    t.integer "shares"
    t.float "amount"
    t.float "goal"
    t.float "pounds"
    t.float "goal_pounds"
    t.integer "backers"
    t.integer "days"
    t.string "time"
    t.boolean "trending"
    t.boolean "english"
    t.text "story_text"
    t.text "story_html"
    t.integer "link_count"
    t.integer "flesch_reading_ease"
    t.integer "dale_chall_readability_score"
    t.integer "smog_index"
    t.integer "difficult_words"
    t.integer "word_count"
    t.float "textmood_score"
    t.float "sentimental_score"
    t.text "sentiment"
    t.integer "updates_count"
    t.datetime "created_at", null: false
    t.integer "fb_shares"
    t.boolean "hearted"
    t.integer "star_rating"
    t.string "category"
    t.datetime "updated_at", null: false
    t.float "euros"
    t.float "goal_euros"
  end

  create_table "updates", force: :cascade do |t|
    t.integer "project_id"
    t.string "title"
    t.string "time_ago"
    t.text "update_html"
    t.text "update_text"
    t.integer "link_count"
    t.integer "flesch_reading_ease"
    t.integer "dale_chall_readability_score"
    t.integer "smog_index"
    t.integer "difficult_words"
    t.integer "word_count"
    t.float "textmood_score"
    t.float "sentimental_score"
    t.text "sentiment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_updates_on_project_id"
  end

end
