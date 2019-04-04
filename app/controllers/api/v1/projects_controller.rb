class Api::V1::ProjectsController < ApplicationController
  def index
    @page = params[:page].to_i
    # @projects = Project.where('english > 0 and category in ("mtf", "ftm") or category is null').paginate(:page => @page)
    @projects = Project.where("category in ('mtf', 'ftm')").order("amount asc").paginate(:page => @page)
    render 'index'
  end

  def create
    project = Project.create(project_params)
    render json: project
  end

  def destroy
    Project.destroy(params[:id])
  end

  def update
    project = Project.find(params[:id])
    project.update_attributes(project_params)
    render json: project
  end

  private

  def project_params
    params.require(:project).permit(:name, :profile, :category, :location, :title, :image, :youtube, :vimeo, :images, :shares, :amount, :goal, :pounds, :goal_pounds, :backers, :days, :time, :trending, :english, :story_text, :story_html, :updates, :created_at, :fb_shares, :hearted, :star_rating)
  end
end
