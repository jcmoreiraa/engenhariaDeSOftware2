class SessionsController < ApplicationController
  def login
    user = User.find_by(id: params[:id])
    if user
      render json: { message: "Logado!", user: user }
    else
      render json: { error: "Usuário não encontrado" }, status: :not_found
    end
  end
end
