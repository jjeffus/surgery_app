class Api::V1::SearchController < ApplicationController
  def index
    @url = params[:url]
    data = Gofundme::Project.scrape(@url)
    @project = Project.new_from_gofundme(data.to_hash)
    if @project
      @code = 200
      @message = "Success"
    else
      @code = 404
      @message = "Not Found"
    end
    render 'index'
  end
end
