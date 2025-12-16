class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :nome, presence: true
  validates :role, presence: true, inclusion: { in: %w[Aluno Coordenação] }

  has_many :pedidos, dependent: :destroy

  scope :alunos, -> { where(role: "Aluno") }
  scope :coordenacao, -> { where(role: "Coordenação") }
end
