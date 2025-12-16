class AddMissingFieldsToPedidos < ActiveRecord::Migration[8.1]
  def change
    add_column :pedidos, :tipo_atividade, :string
    add_column :pedidos, :instituicao, :string
    add_column :pedidos, :data_inicio, :date
    add_column :pedidos, :data_fim, :date
    add_column :pedidos, :prioridade, :boolean, default: false
    add_column :pedidos, :status, :string, default: "em_analise"
    add_column :pedidos, :resposta_coordenacao, :text
  end
end

