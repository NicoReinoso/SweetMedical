import { useState, useEffect } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import api from "../../api/api.js";
import { useSession } from "../../context/SessionContext.jsx";
import { useNotificaciones } from "../../context/NotificacionesContext.jsx";

function Notificaciones({ rol }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [notificacionesLeidas, setNotificacionesLeidas] = useState([]);
  const [mostrarLeidas, setMostrarLeidas] = useState(false);
  const { user } = useSession();
  const { setNoLeidasCount } = useNotificaciones();

  useEffect(() => {
    if (user?.id) {
      cargarNotificaciones();
    }
  }, [user]);

  const cargarNotificaciones = async () => {
    try {
      const { data } = await api.get(`/notificaciones/${user?.id}`, {
        params: { estado: "NO_LEIDA" },
      });
      setNotificaciones(data);
      setNoLeidasCount(data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarNotificacionesLeidas = async () => {
    try {
      const { data } = await api.get(`/notificaciones/${user?.id}`, {
        params: { estado: "LEIDA" },
      });
      setNotificacionesLeidas(data);
      setMostrarLeidas(true);
    } catch (err) {
      console.error(err);
    }
  };

  const marcarComoLeida = async (id) => {
    try {
      await api.patch(`/notificaciones/${id}`);

      setNotificaciones((prev) => {
        const actualizadas = prev.filter((n) => n._id !== id);
        setNoLeidasCount(actualizadas.length);
        return actualizadas;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      await Promise.all(
        notificaciones.map((n) => api.patch(`/notificaciones/${n._id}`))
      );
      setNotificaciones([]);
      setNoLeidasCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <div className="page-header">
        <h1>Notificaciones</h1>
        <p className="text-muted mb-0">
          Consultá tus notificaciones recientes y marcá las que ya hayas leído.
        </p>
      </div>

      {notificaciones.length === 0 ? (
        <Card className="text-center p-4 mb-3">
          <Card.Body>
            <Card.Title>No hay notificaciones nuevas</Card.Title>
            <Card.Text>
              No cuenta con notificaciones nuevas por el momento.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        notificaciones.map((n) => (
          <Card key={n._id} className="mb-3 border-primary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Text>{n.mensaje}</Card.Text>
                  <small>{n.fecha}</small>
                </div>

                <Badge bg="primary">Nueva</Badge>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="mt-3"
                onClick={() => marcarComoLeida(n._id)}
              >
                Marcar como leída
              </Button>
            </Card.Body>
          </Card>
        ))
      )}

      <div className="d-flex justify-content-between mb-3">
        <div>
          {notificaciones.length > 0 && (
            <Button variant="primary" onClick={marcarTodasComoLeidas}>
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {!mostrarLeidas && (
          <Button variant="primary" onClick={cargarNotificacionesLeidas}>
            Mostrar anteriores
          </Button>
        )}
      </div>

      {mostrarLeidas &&
        notificacionesLeidas.map((n) => (
          <Card key={n._id} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Text>{n.mensaje}</Card.Text>
                  <small>{n.fecha}</small>
                </div>

                <Badge bg="secondary">Leída</Badge>
              </div>
            </Card.Body>
          </Card>
        ))}
    </div>
  );
}

export default Notificaciones;