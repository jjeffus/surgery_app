class HomeController < ApplicationController
  def index
    @url = params[:url] || ''
  end
end
