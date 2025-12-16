Rails.application.routes.draw do
  resources :pedidos do
    member do
      post :approve
      post :reject
      post :cancel
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  post "/login", to: "sessions#login"
  post "/logout", to: "sessions#logout"
  get "/pedido_by_user", to: "pedidos#pedido_by_user"

  # Defines the root path route ("/")
  # root "posts#index"
end
