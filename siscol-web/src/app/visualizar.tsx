import { List, Paper, Typography, Box, Chip, Button, Link } from "@mui/material";
import { useEffect, useState } from "react";

interface VisualizarProps {
  id: number;
  titulo: string;
  descricao: string;
  horas: number;
  user_id: number;
  tipo_atividade?: string;
  instituicao?: string;
  data_inicio?: string;
  data_fim?: string;
  prioridade?: boolean;
  status?: string;
  status_display?: string;
  resposta_coordenacao?: string;
  comprovante_url?: string;
}

export const Visualizar = () => {
  const [pedidos, setPedidos] = useState<VisualizarProps[]>([]);
  
  const returnApi = async () => {
    try {
      const response = await fetch('http://localhost:3001/pedido_by_user?id=2');
      const data = await response.json();
      console.log(data);
      setPedidos(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  const cancelarPedido = async (pedidoId: number) => {
    if (!confirm("Tem certeza que deseja cancelar esta solicitação?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/pedidos/${pedidoId}/cancel`, {
        method: "POST",
      });
      
      if (response.ok) {
        returnApi(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao cancelar solicitação");
      }
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
      alert("Erro ao cancelar solicitação");
    }
  };

  useEffect(() => {
    returnApi();
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "aprovada":
        return "success";
      case "recusada":
        return "error";
      case "em_analise":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "30px auto" }}>
      <Typography variant="h4" mb={3}>
        Minhas Solicitações
      </Typography>
      
      <List>
        {pedidos.length === 0 ? (
          <Typography>Nenhuma solicitação encontrada.</Typography>
        ) : (
          pedidos.map((pedido: VisualizarProps) => (
            <Paper key={pedido.id} elevation={2} sx={{ p: 3, mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                <Typography variant="h6">{pedido.titulo}</Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {pedido.prioridade && (
                    <Chip label="Prioridade" color="warning" size="small" />
                  )}
                  <Chip 
                    label={pedido.status_display || pedido.status || "Em análise"} 
                    color={getStatusColor(pedido.status) as any}
                    size="small"
                  />
                </Box>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                <Typography><strong>Tipo de Atividade:</strong> {pedido.tipo_atividade || "N/A"}</Typography>
                <Typography><strong>Instituição:</strong> {pedido.instituicao || "N/A"}</Typography>
                <Typography><strong>Data de Início:</strong> {pedido.data_inicio || "N/A"}</Typography>
                <Typography><strong>Data de Fim:</strong> {pedido.data_fim || "N/A"}</Typography>
                <Typography><strong>Horas:</strong> {pedido.horas}</Typography>
              </Box>

              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Descrição:</strong> {pedido.descricao}
              </Typography>

              {pedido.resposta_coordenacao && (
                <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Resposta da Coordenação:</strong>
                  </Typography>
                  <Typography variant="body2">{pedido.resposta_coordenacao}</Typography>
                </Box>
              )}

              {pedido.comprovante_url && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Comprovante:</strong>
                  </Typography>
                  <Link href={pedido.comprovante_url} target="_blank" rel="noopener">
                    Ver PDF
                  </Link>
                </Box>
              )}

              {pedido.status === "em_analise" && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={() => cancelarPedido(pedido.id)}
                >
                  Cancelar Solicitação
                </Button>
              )}
            </Paper>
          ))
        )}
      </List>
    </Box>
  );
};