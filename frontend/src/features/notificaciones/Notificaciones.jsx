import { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";

function Notificaciones({ rol }) {
    //MOCK
    const [notificaciones, setNotificaciones] = useState([
  {
    id: 1,
    mensaje: "Su turno fue confirmado",
    fecha: "15/06/2026",
    leida: false
  },
  {
    id: 2,
    mensaje: "Su turno fue reprogramado",
    fecha: "16/06/2026",
    leida: true
  }
]);
    const marcarComoLeida = (id) => {
    setNotificaciones((prev) =>
        prev.map((n) =>
        n.id === id
            ? { ...n, leida: true }
            : n
        )
    );
    };

  return (
    <div className="container py-4">
      <h1>Notificaciones</h1>

      {notificaciones.map((n) => (
       <Card
        key={n.id}
        className={`mb-3 ${!n.leida ? "border-primary" : ""}`}
        >
        <Card.Body>

            <div className="d-flex justify-content-between align-items-start">

            <div>
                <Card.Text>{n.mensaje}</Card.Text>
                <small>{n.fecha}</small>
            </div>

            <Badge bg={n.leida ? "secondary" : "primary"}>
                {n.leida ? "Leída" : "Nueva"}
            </Badge>

            </div>

            {!n.leida && (
            <Button
                variant="outline-primary"
                size="sm"
                className="mt-3"
                onClick={() => marcarComoLeida(n.id)}
            >
                Marcar como leída
            </Button>
            )}

        </Card.Body>
        </Card>
      ))}
    </div>
  );
}



export default Notificaciones;