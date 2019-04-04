json.projects do
  json.array! @projects, partial: 'api/v1/projects/project', as: :project
end
json.pagination do
  json.page @page
  json.slice "#{((@page - 1) * Project.per_page) + 1} to #{@page * Project.per_page}"
  json.per_page Project.per_page
  json.pages (Project.by_amount.count / Project.per_page).ceil
  json.total Project.by_amount.count
end
