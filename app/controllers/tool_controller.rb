class ToolController < ApplicationController
  def index
    @url = params[:url] || ''
  end
end
