"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Link,
  Alert,
} from "@mui/material";

interface Pedido {
  id: number;
  titulo: string;
  descricao: string;
  horas: number;
  tipo_atividade?: string;
  instituicao?: string;
  data_inicio?: string;
  data_fim?: string;
  prioridade?: boolean;
  status?: string;
  status_display?: string;
  resposta_coordenacao?: string;
  comprovante_url?: string;
  user?: {
    id: number;
    nome: string;
    email: string;
  };
}

export default function CoordenacaoPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [justificativa, setJustificativa] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchPedidos = async () => {
    try {
      const response = await fetch("http://localhost:3001/pedidos");
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      setMessage({ type: "error", text: "Erro ao carregar solicitações" });
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleApprove = async () => {
    if (!selectedPedido) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/pedidos/${selectedPedido.id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resposta_coordenacao: justificativa || "Solicitação aprovada.",
          }),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "Solicitação aprovada com sucesso!" });
        setApproveDialogOpen(false);
        setJustificativa("");
        setSelectedPedido(null);
        fetchPedidos();
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.error || "Erro ao aprovar solicitação" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao aprovar solicitação" });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPedido || !justificativa.trim()) {
      setMessage({ type: "error", text: "Justificativa é obrigatória para recusar" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/pedidos/${selectedPedido.id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resposta_coordenacao: justificativa,
          }),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "Solicitação recusada." });
        setRejectDialogOpen(false);
        setJustificativa("");
        setSelectedPedido(null);
        fetchPedidos();
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.error || "Erro ao recusar solicitação" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao recusar solicitação" });
    } finally {
      setLoading(false);
    }
  };

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

  const pedidosPendentes = pedidos.filter((p) => p.status === "em_analise");

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: "30px auto" }}>
      <Typography variant="h4" mb={3}>
        Fila de Solicitações - Coordenação
      </Typography>

      {message && (
        <Alert
          severity={message.type}
          onClose={() => setMessage(null)}
          sx={{ mb: 2 }}
        >
          {message.text}
        </Alert>
      )}

      <Typography variant="h6" mb={2}>
        Pendentes: {pedidosPendentes.length} | Total: {pedidos.length}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {pedidos.length === 0 ? (
          <Typography>Nenhuma solicitação encontrada.</Typography>
        ) : (
          pedidos.map((pedido) => (
            <Paper key={pedido.id} elevation={2} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6">{pedido.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aluno: {pedido.user?.nome || "N/A"} ({pedido.user?.email || "N/A"})
                  </Typography>
                </Box>
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

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Typography>
                  <strong>Tipo de Atividade:</strong> {pedido.tipo_atividade || "N/A"}
                </Typography>
                <Typography>
                  <strong>Instituição:</strong> {pedido.instituicao || "N/A"}
                </Typography>
                <Typography>
                  <strong>Data de Início:</strong> {pedido.data_inicio || "N/A"}
                </Typography>
                <Typography>
                  <strong>Data de Fim:</strong> {pedido.data_fim || "N/A"}
                </Typography>
                <Typography>
                  <strong>Horas:</strong> {pedido.horas}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Descrição:</strong> {pedido.descricao}
              </Typography>

              {pedido.comprovante_url && (
                <Box sx={{ mb: 2 }}>
                  <Link href={pedido.comprovante_url} target="_blank" rel="noopener">
                    Ver Comprovante (PDF)
                  </Link>
                </Box>
              )}

              {pedido.status === "em_analise" && (
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      setSelectedPedido(pedido);
                      setApproveDialogOpen(true);
                    }}
                  >
                    Aprovar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setSelectedPedido(pedido);
                      setRejectDialogOpen(true);
                    }}
                  >
                    Recusar
                  </Button>
                </Box>
              )}

              {pedido.resposta_coordenacao && (
                <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1, mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Resposta Enviada:</strong>
                  </Typography>
                  <Typography variant="body2">{pedido.resposta_coordenacao}</Typography>
                </Box>
              )}
            </Paper>
          ))
        )}
      </Box>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle>Aprovar Solicitação</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Mensagem (opcional)"
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            placeholder="Solicitação aprovada."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleApprove} variant="contained" color="success" disabled={loading}>
            Aprovar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Recusar Solicitação</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Justificativa *"
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            placeholder="Informe o motivo da recusa..."
            required
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleReject}
            variant="contained"
            color="error"
            disabled={loading || !justificativa.trim()}
          >
            Recusar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

