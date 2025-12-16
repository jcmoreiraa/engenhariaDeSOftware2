class PedidosController < ApplicationController
  before_action :set_pedido, only: %i[ show update destroy approve reject cancel ]
  before_action :require_coordenacao!, only: %i[ index approve reject ]
  before_action :require_aluno!, only: %i[ create cancel ]
  include Rails.application.routes.url_helpers

  # GET /pedidos (Coordenação only - all pedidos)
  def index
    @pedidos = Pedido.all.por_prioridade

    render json: @pedidos.map { |pedido| format_pedido_json(pedido) }
  end

  # GET /pedidos/1
  def show
    render json: format_pedido_json(@pedido)
  end

  def pedido_by_user
    user_id = params[:id] || current_user&.id
    pedidos = Pedido.where(user_id: user_id).order(created_at: :desc)

    # Allow alunos to see only their own pedidos
    if current_user&.role == "Aluno" && user_id.to_i != current_user.id
      render json: { error: "Acesso negado" }, status: :forbidden
      return
    end

    render json: pedidos.map { |pedido| format_pedido_json(pedido) }
  end

  # POST /pedidos
  def create
    @pedido = Pedido.new(pedido_params)
    @pedido.status = "em_analise" unless @pedido.status.present?
    @pedido.user_id = current_user.id if current_user&.role == "Aluno"

    # Validate PDF file type
    if @pedido.comprovante.attached? && @pedido.comprovante.content_type != "application/pdf"
      render json: { error: "Apenas arquivos PDF são permitidos" }, status: :unprocessable_content
      return
    end

    if @pedido.save
      render json: format_pedido_json(@pedido), status: :created, location: @pedido
    else
      render json: @pedido.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /pedidos/1
  def update
    if @pedido.update(pedido_params)
      render json: format_pedido_json(@pedido)
    else
      render json: @pedido.errors, status: :unprocessable_content
    end
  end

  # DELETE /pedidos/1
  def destroy
    @pedido.destroy!
  end

  # POST /pedidos/:id/approve
  def approve
    if @pedido.status != "em_analise"
      render json: { error: "Solicitação já foi analisada" }, status: :unprocessable_content
      return
    end

    @pedido.status = "aprovada"
    @pedido.resposta_coordenacao = params[:resposta_coordenacao] || "Solicitação aprovada."

    if @pedido.save
      render json: format_pedido_json(@pedido)
    else
      render json: @pedido.errors, status: :unprocessable_content
    end
  end

  # POST /pedidos/:id/reject
  def reject
    if @pedido.status != "em_analise"
      render json: { error: "Solicitação já foi analisada" }, status: :unprocessable_content
      return
    end

    if params[:resposta_coordenacao].blank?
      render json: { error: "Justificativa é obrigatória para recusar" }, status: :unprocessable_content
      return
    end

    @pedido.status = "recusada"
    @pedido.resposta_coordenacao = params[:resposta_coordenacao]

    if @pedido.save
      render json: format_pedido_json(@pedido)
    else
      render json: @pedido.errors, status: :unprocessable_content
    end
  end

  # POST /pedidos/:id/cancel
  def cancel
    if @pedido.status != "em_analise"
      render json: { error: "Apenas solicitações pendentes podem ser canceladas" }, status: :unprocessable_content
      return
    end

    # Alunos can only cancel their own pedidos
    if current_user&.role == "Aluno" && @pedido.user_id != current_user.id
      render json: { error: "Acesso negado" }, status: :forbidden
      return
    end

    @pedido.destroy!
    render json: { message: "Solicitação cancelada com sucesso" }, status: :ok
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_pedido
    @pedido = Pedido.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def pedido_params
    params.require(:pedido).permit(
      :titulo,
      :descricao,
      :horas,
      :user_id,
      :comprovante,
      :tipo_atividade,
      :instituicao,
      :data_inicio,
      :data_fim,
      :prioridade
    )
  end

  def format_pedido_json(pedido)
    pedido.as_json.merge(
      comprovante_url: pedido.comprovante.attached? ? url_for(pedido.comprovante) : nil,
      status_display: pedido.status_display,
      user: pedido.user.as_json(only: [:id, :nome, :email])
    )
  end
end
