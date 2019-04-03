class CampaignsController < ApplicationController
  def index
    @query = params[:q]
    @page = params[:page] || 1
    @cursor = params[:cursor] || 0
    if params.has_key? :page
      respond_to do |format|
        format.html
      end
    else
      redirect_to controller: 'campaigns', action: 'index', page: @page, cursor: @cursor
    end
  end
end
