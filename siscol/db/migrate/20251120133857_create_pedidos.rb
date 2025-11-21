class CreatePedidos < ActiveRecord::Migration[8.1]
  def change
    create_table :pedidos do |t|
      t.string :titulo
      t.string :descricao
      t.integer :horas
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
