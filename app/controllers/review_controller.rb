class ReviewController < ApplicationController
  def index
    @page = params[:page] || 1
    @cursor = params[:cursor] || 0
    if params.has_key? :page
      respond_to do |format|
        format.html
      end
    else
      redirect_to controller: 'review', action: 'index', page: @page, cursor: @cursor
    end
  end
end
