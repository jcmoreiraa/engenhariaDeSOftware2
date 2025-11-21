import * as yup from "yup";

export const formDataSchema = yup.object({
  titulo: yup.string().required(),
  descricao: yup.string().required(),
  horas: yup.string().required(),
  user_id: yup.string().required(),
  comprovante: yup
    .mixed<FileList>()
    .required()
    .test("file-required", "O comprovante é obrigatório", (value: any) => {
      return value && value.length > 0;
    }),
});
