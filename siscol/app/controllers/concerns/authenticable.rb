module Authenticable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user!, except: [:login]
  end

  private

  def authenticate_user!
    token = request.headers["Authorization"]&.split(" ")&.last
    user_id = token || params[:user_id]

    @current_user = User.find_by(id: user_id)

    unless @current_user
      render json: { error: "Não autorizado" }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def require_coordenacao!
    unless current_user&.role == "Coordenação"
      render json: { error: "Acesso negado. Apenas coordenação pode realizar esta ação." }, status: :forbidden
    end
  end

  def require_aluno!
    unless current_user&.role == "Aluno"
      render json: { error: "Acesso negado. Apenas alunos podem realizar esta ação." }, status: :forbidden
    end
  end
end

