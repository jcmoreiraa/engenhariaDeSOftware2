class Pedido < ApplicationRecord
  belongs_to :user
  has_one_attached :comprovante

  validates :titulo, presence: true, length: { minimum: 3, maximum: 200 }
  validates :tipo_atividade, presence: true
  validates :instituicao, presence: true, length: { minimum: 2, maximum: 200 }
  validates :data_inicio, presence: true
  validates :data_fim, presence: true
  validates :horas, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: 1000 }
  validates :status, presence: true, inclusion: { in: %w[em_analise aprovada recusada] }, allow_nil: false
  validate :data_fim_after_data_inicio
  validate :comprovante_pdf_required, on: :create

  scope :pendentes, -> { where(status: "em_analise") }
  scope :por_prioridade, -> { order(prioridade: :desc, created_at: :asc) }

  def status_display
    case status
    when "em_analise"
      "Em análise"
    when "aprovada"
      "Aprovada"
    when "recusada"
      "Recusada"
    else
      status
    end
  end

  private

  def data_fim_after_data_inicio
    return unless data_inicio.present? && data_fim.present?

    if data_fim < data_inicio
      errors.add(:data_fim, "deve ser posterior à data de início")
    end
  end

  def comprovante_pdf_required
    return if comprovante.attached?

    errors.add(:comprovante, "é obrigatório")
  end
end
