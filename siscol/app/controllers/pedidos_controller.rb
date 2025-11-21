class PedidosController < ApplicationController
  before_action :set_pedido, only: %i[ show update destroy ]
  include Rails.application.routes.url_helpers

  # GET /pedidos
  def index
    @pedidos = Pedido.all

    render json: @pedidos
  end

  # GET /pedidos/1
  def show
    render json: pedidos.map { |pedido|
      pedido.as_json.merge(
        comprovante_url: pedido.comprovante.attached? ? url_for(pedido.comprovante) : nil,
      )
    }
  end

  def pedido_by_user
    pedidos = Pedido.where(user_id: params[:id])

    render json: pedidos.map { |pedido|
      pedido.as_json.merge(
        comprovante_url: pedido.comprovante.attached? ? url_for(pedido.comprovante) : nil,
      )
    }
  end

  # POST /pedidos
  def create
    @pedido = Pedido.new(pedido_params)

    if @pedido.save
      render json: @pedido, status: :created, location: @pedido
    else
      render json: @pedido.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /pedidos/1
  def update
    if @pedido.update(pedido_params)
      render json: @pedido
    else
      render json: @pedido.errors, status: :unprocessable_content
    end
  end

  # DELETE /pedidos/1
  def destroy
    @pedido.destroy!
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_pedido
    @pedido = Pedido.find(params.expect(:id))
  end

  # Only allow a list of trusted parameters through.
  def pedido_params
    params.require(:pedido).permit(
      :titulo,
      :descricao,
      :horas,
      :user_id,
      :comprovante
    )
  end
end
