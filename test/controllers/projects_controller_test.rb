require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @project = projects(:one)
  end

  test "should get index" do
    get projects_url
    assert_response :success
  end

  test "should get new" do
    get new_project_url
    assert_response :success
  end

  test "should create project" do
    assert_difference('Project.count') do
      post projects_url, params: { project: { amount: @project.amount, backers: @project.backers, category: @project.category, created_at: @project.created_at, days: @project.days, english: @project.english, fb_shares: @project.fb_shares, goal: @project.goal, goal_pounds: @project.goal_pounds, image: @project.image, images: @project.images, location: @project.location, name: @project.name, pounds: @project.pounds, profile: @project.profile, shares: @project.shares, story_html: @project.story_html, story_text: @project.story_text, time: @project.time, title: @project.title, trending: @project.trending, updates: @project.updates, vimeo: @project.vimeo, youtube: @project.youtube } }
    end

    assert_redirected_to project_url(Project.last)
  end

  test "should show project" do
    get project_url(@project)
    assert_response :success
  end

  test "should get edit" do
    get edit_project_url(@project)
    assert_response :success
  end

  test "should update project" do
    patch project_url(@project), params: { project: { amount: @project.amount, backers: @project.backers, category: @project.category, created_at: @project.created_at, days: @project.days, english: @project.english, fb_shares: @project.fb_shares, goal: @project.goal, goal_pounds: @project.goal_pounds, image: @project.image, images: @project.images, location: @project.location, name: @project.name, pounds: @project.pounds, profile: @project.profile, shares: @project.shares, story_html: @project.story_html, story_text: @project.story_text, time: @project.time, title: @project.title, trending: @project.trending, updates: @project.updates, vimeo: @project.vimeo, youtube: @project.youtube } }
    assert_redirected_to project_url(@project)
  end

  test "should destroy project" do
    assert_difference('Project.count', -1) do
      delete project_url(@project)
    end

    assert_redirected_to projects_url
  end
end
