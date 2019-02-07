json.extract! project, :id, :gofundme_key, :name, :profile, :gofundme_category, :location, :title, :image, :youtube, :vimeo, :images, :shares, :amount, :goal, :pounds, :goal_pounds, :backers, :days, :time, :trending, :english, :story_text, :story_html, :updates, :created_at, :fb_shares, :created_at, :updated_at, :hearted, :star_rating, :category
json.url api_v1_project_url(project, format: :json)
