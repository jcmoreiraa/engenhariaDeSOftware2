class SessionsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:login]

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      render json: {
        message: "Logado!",
        user: user.as_json(only: [:id, :nome, :email, :role])
      }
    else
      render json: { error: "Email ou senha inválidos" }, status: :unauthorized
    end
  end

  def logout
    render json: { message: "Logout realizado com sucesso" }
  end
end
