Rails.application.routes.draw do
  get '/wake/now(.:format)', to: 'wake#now'
  get "/tool", to: "tool#index"
  post "/tool", to: "tool#index"
  get "/workshops", to: "home#workshops"
  get "/campaigns", to: "campaigns#index"
  namespace :api do
    namespace :v1 do
     resources :projects, only: [:create, :destroy, :update]
     namespace :projects do
       get 'index/:page', action: 'index'
     end
     namespace :search do
       get 'index', action: 'index'
     end
    end
  end
  root :to => 'home#index'
end
