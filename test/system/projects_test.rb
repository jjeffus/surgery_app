require "application_system_test_case"

class ProjectsTest < ApplicationSystemTestCase
  setup do
    @project = projects(:one)
  end

  test "visiting the index" do
    visit projects_url
    assert_selector "h1", text: "Projects"
  end

  test "creating a Project" do
    visit projects_url
    click_on "New Project"

    fill_in "Amount", with: @project.amount
    fill_in "Backers", with: @project.backers
    fill_in "Category", with: @project.category
    fill_in "Created at", with: @project.created_at
    fill_in "Days", with: @project.days
    fill_in "English", with: @project.english
    fill_in "Fb shares", with: @project.fb_shares
    fill_in "Goal", with: @project.goal
    fill_in "Goal pounds", with: @project.goal_pounds
    fill_in "Image", with: @project.image
    fill_in "Images", with: @project.images
    fill_in "Location", with: @project.location
    fill_in "Name", with: @project.name
    fill_in "Pounds", with: @project.pounds
    fill_in "Profile", with: @project.profile
    fill_in "Shares", with: @project.shares
    fill_in "Story html", with: @project.story_html
    fill_in "Story text", with: @project.story_text
    fill_in "Time", with: @project.time
    fill_in "Title", with: @project.title
    fill_in "Trending", with: @project.trending
    fill_in "Updates", with: @project.updates
    fill_in "Vimeo", with: @project.vimeo
    fill_in "Youtube", with: @project.youtube
    click_on "Create Project"

    assert_text "Project was successfully created"
    click_on "Back"
  end

  test "updating a Project" do
    visit projects_url
    click_on "Edit", match: :first

    fill_in "Amount", with: @project.amount
    fill_in "Backers", with: @project.backers
    fill_in "Category", with: @project.category
    fill_in "Created at", with: @project.created_at
    fill_in "Days", with: @project.days
    fill_in "English", with: @project.english
    fill_in "Fb shares", with: @project.fb_shares
    fill_in "Goal", with: @project.goal
    fill_in "Goal pounds", with: @project.goal_pounds
    fill_in "Image", with: @project.image
    fill_in "Images", with: @project.images
    fill_in "Location", with: @project.location
    fill_in "Name", with: @project.name
    fill_in "Pounds", with: @project.pounds
    fill_in "Profile", with: @project.profile
    fill_in "Shares", with: @project.shares
    fill_in "Story html", with: @project.story_html
    fill_in "Story text", with: @project.story_text
    fill_in "Time", with: @project.time
    fill_in "Title", with: @project.title
    fill_in "Trending", with: @project.trending
    fill_in "Updates", with: @project.updates
    fill_in "Vimeo", with: @project.vimeo
    fill_in "Youtube", with: @project.youtube
    click_on "Update Project"

    assert_text "Project was successfully updated"
    click_on "Back"
  end

  test "destroying a Project" do
    visit projects_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Project was successfully destroyed"
  end
end
