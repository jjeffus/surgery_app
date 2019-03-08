class Api::V1::SearchController < ApplicationController
  def index
    @url = params[:url]
    data = Gofundme::Project.scrape(@url)
    if data
      @project = Project.new_from_gofundme(data.to_hash)
      @project.listed = params[:listed] || true
      @project.save!
      @code = 200
      @message = "Success"
    else
      @code = 404
      @message = "Not Found"
    end
    render 'index'
  end
end
