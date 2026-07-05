import { useState, useEffect } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import api from "../../api/api.js";
import { useSession } from "../../context/SessionContext.jsx";

function Notificaciones({ rol }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const { user } = useSession();

  useEffect(() => {
  if (user?.id) {
    cargarNotificaciones();
  }
  }, [user]);

  const cargarNotificaciones = async () => {
    try {

      const { data } = await api.get(`/notificaciones/${user?.id}`);
      setNotificaciones(data);
    } catch (err) {
      console.error(err);
    }
  };

  const marcarComoLeida = async (id) => {
    try {
      await api.patch(`/notificaciones/${id}`);

      setNotificaciones((prev) =>
        prev.map((n) =>
          n._id === id
            ? { ...n, leida: true }
            : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <h1>Notificaciones</h1>
          {notificaciones.length === 0 ? (
      <Card className="text-center p-4">
        <Card.Body>
          <Card.Title>No hay notificaciones</Card.Title>
          <Card.Text>
            No tenés notificaciones disponibles por el momento.
          </Card.Text>
        </Card.Body>
      </Card>
    ) : (
      notificaciones.map((n) => (
        <Card
          key={n._id}
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
                variant="primary"
                size="sm"
                className="mt-3"
                onClick={() => marcarComoLeida(n._id)}
              >
                Marcar como leída
              </Button>
            )}
          </Card.Body>
        </Card>
      ))
    )}
  </div>
);
}

export default Notificaciones;