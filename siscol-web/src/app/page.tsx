"use client";

import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { formDataSchema } from "@/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormDataTypes } from "@/types/formDataTypes";
import { LoadingButton } from '@mui/lab';


import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Visualizar } from "./visualizar";

export default function AlunoPage() {
  const methods = useForm<FormDataTypes>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(formDataSchema),
  });

  const { register } = methods;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onSubmit = methods.handleSubmit (async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("pedido[titulo]", data.titulo);
    formData.append("pedido[descricao]", data.descricao);
    formData.append("pedido[horas]", data.horas);
    formData.append("pedido[user_id]", data.user_id);

    if (data.comprovante && data.comprovante.length > 0) {
      formData.append("pedido[comprovante]", data.comprovante[0]);
    }

    try {
      const res = await axios.post("http://localhost:3001/pedidos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);
      console.log(res.data);
    } catch (err: any) {
      setResult(err.response?.data || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  });

  return (
    <><FormProvider {...methods}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: "30px auto" }}>
        <Typography variant="h4" mb={3}>
          Enviar Pedido
        </Typography>

        <Box
          component="form"
          onSubmit={(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField label="Título" {...register("titulo")} />

          <TextField
            label="Descrição"
            multiline
            minRows={3}
            {...register("descricao")} />

          <TextField
            label="Horas complementares"
            type="number"
            {...register("horas")} />

          <TextField
            label="ID do Aluno"
            type="number"
            {...register("user_id")} />

          <Button variant="outlined" component="label">
            Enviar comprovante
            <input type="file" hidden {...register("comprovante")} />
          </Button>

          <LoadingButton type="submit" variant="contained" disabled={loading}>
             ENviar
          </LoadingButton>
        </Box>

        {result && (
          <Box mt={4}>
            <Typography variant="h6">Resposta do servidor:</Typography>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </Box>
        )}
      </Paper>
    </FormProvider><Visualizar /></>
  );
}
