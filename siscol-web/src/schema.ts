import * as yup from "yup";

export const formDataSchema = yup.object({
  titulo: yup
    .string()
    .required("Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  descricao: yup
    .string()
    .required("Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  horas: yup
    .string()
    .required("Horas são obrigatórias")
    .test("is-number", "Horas devem ser um número válido", (value) => {
      if (!value) return false;
      const num = Number(value);
      return !isNaN(num) && num > 0 && num <= 1000;
    }),
  user_id: yup.string(),
  tipo_atividade: yup.string().required("Tipo de atividade é obrigatório"),
  instituicao: yup
    .string()
    .required("Instituição é obrigatória")
    .min(2, "Instituição deve ter pelo menos 2 caracteres")
    .max(200, "Instituição deve ter no máximo 200 caracteres"),
  data_inicio: yup.string().required("Data de início é obrigatória"),
  data_fim: yup
    .string()
    .required("Data de fim é obrigatória")
    .test("after-inicio", "Data de fim deve ser posterior à data de início", function (value) {
      const { data_inicio } = this.parent;
      if (!value || !data_inicio) return true;
      return new Date(value) >= new Date(data_inicio);
    }),
  prioridade: yup.boolean().default(false),
  comprovante: yup
    .mixed<FileList>()
    .required("O comprovante é obrigatório")
    .test("file-required", "O comprovante é obrigatório", (value: any) => {
      return value && value.length > 0;
    })
    .test("file-type", "Apenas arquivos PDF são permitidos", (value: any) => {
      if (!value || value.length === 0) return true;
      return value[0]?.type === "application/pdf";
    })
    .test("file-size", "O arquivo deve ter no máximo 10MB", (value: any) => {
      if (!value || value.length === 0) return true;
      return value[0]?.size <= 10 * 1024 * 1024; // 10MB
    }),
});
