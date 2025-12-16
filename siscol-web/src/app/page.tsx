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
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visualizar } from "./visualizar";

export default function AlunoPage() {
  const methods = useForm<FormDataTypes>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(formDataSchema),
  });

  const { register, formState: { errors }, watch, setValue } = methods;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onSubmit = methods.handleSubmit (async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("pedido[titulo]", data.titulo);
    formData.append("pedido[descricao]", data.descricao);
    formData.append("pedido[horas]", data.horas);
    formData.append("pedido[tipo_atividade]", data.tipo_atividade);
    formData.append("pedido[instituicao]", data.instituicao);
    formData.append("pedido[data_inicio]", data.data_inicio);
    formData.append("pedido[data_fim]", data.data_fim);
    formData.append("pedido[prioridade]", data.prioridade ? "true" : "false");
    if (data.user_id) {
      formData.append("pedido[user_id]", data.user_id);
    }

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
          <TextField 
            label="Título" 
            {...register("titulo")} 
            error={!!errors.titulo}
            helperText={errors.titulo?.message}
          />

          <FormControl fullWidth error={!!errors.tipo_atividade}>
            <InputLabel>Tipo de Atividade</InputLabel>
            <Select
              value={watch("tipo_atividade") || ""}
              onChange={(e) => setValue("tipo_atividade", e.target.value)}
              label="Tipo de Atividade"
            >
              <MenuItem value="Curso">Curso</MenuItem>
              <MenuItem value="Evento">Evento</MenuItem>
              <MenuItem value="Projeto">Projeto</MenuItem>
              <MenuItem value="Extensão">Extensão</MenuItem>
              <MenuItem value="Pesquisa">Pesquisa</MenuItem>
              <MenuItem value="Outro">Outro</MenuItem>
            </Select>
            {errors.tipo_atividade && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.tipo_atividade.message}
              </Typography>
            )}
          </FormControl>

          <TextField
            label="Instituição Responsável"
            {...register("instituicao")}
            error={!!errors.instituicao}
            helperText={errors.instituicao?.message}
          />

          <TextField
            label="Data de Início"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("data_inicio")}
            error={!!errors.data_inicio}
            helperText={errors.data_inicio?.message}
          />

          <TextField
            label="Data de Fim"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("data_fim")}
            error={!!errors.data_fim}
            helperText={errors.data_fim?.message}
          />

          <TextField
            label="Descrição"
            multiline
            minRows={3}
            {...register("descricao")}
            error={!!errors.descricao}
            helperText={errors.descricao?.message}
          />

          <TextField
            label="Horas complementares"
            type="number"
            {...register("horas")}
            error={!!errors.horas}
            helperText={errors.horas?.message}
          />

          <FormControlLabel
            control={<Checkbox {...register("prioridade")} />}
            label="Sou aluno concluinte (prioridade)"
          />

          <Box>
            <Button variant="outlined" component="label">
              Enviar comprovante (PDF)
              <input 
                type="file" 
                hidden 
                accept="application/pdf"
                {...register("comprovante")} 
              />
            </Button>
            {errors.comprovante && (
              <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                {errors.comprovante.message}
              </Typography>
            )}
          </Box>

          <LoadingButton type="submit" variant="contained" loading={loading}>
            Enviar
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
