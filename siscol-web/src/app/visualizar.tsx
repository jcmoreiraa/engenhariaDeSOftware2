import { List } from "@mui/material";
import { useEffect, useState } from "react";

interface VisualizarProps {
  id: number;
  titulo: string;
  descricao: string;
  horas: string;
  user_id: string;
  comprovante_url?: string;

}
export const Visualizar = () => {
  const [pedidos, setPedidos] = useState<VisualizarProps[]>([]);
  const returnApi = async () => {
    const response = await fetch('http://localhost:3001/pedido_by_user?id=2', {
    });
    const data = await response.json();
    console.log(data)
    setPedidos(data);
  }
  useEffect(() => {
    returnApi();
  }, [])
  return <div>

    <List>
      {pedidos.map((pedido: VisualizarProps) => (
        <div key={pedido.id}>
          <p>{pedido.titulo}</p>
          <p>{pedido.descricao}</p>
          <p>{pedido.horas}</p>
          <p>{pedido.user_id}</p>
          {pedido.comprovante_url && (
            <img
              src={pedido.comprovante_url}
              alt="comprovante"
              style={{ width: "200px" }}
            />
          )}

        </div>
      ))}
    </List>

  </div>;
};