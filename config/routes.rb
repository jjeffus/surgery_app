Rails.application.routes.draw do
  get '/wake/now(.:format)', to: 'wake#now'
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
