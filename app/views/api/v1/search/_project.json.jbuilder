json.extract! project, :id, :gofundme_key, :name, :profile, :gofundme_category, :location, :title, :image, :youtube, :vimeo, :images, :shares, :amount, :goal, :pounds, :goal_pounds, :backers, :days, :time, :trending, :english, :story_text, :story_html, :updates, :created_at, :fb_shares, :created_at, :updated_at, :hearted, :star_rating, :category, :links, :flesch_reading_ease, :dale_chall_readability_score, :smog_index, :difficult_words, :word_count, :textmood_score, :sentimental_score, :sentiment, :updates_count
json.url api_v1_project_url(project, format: :json)
