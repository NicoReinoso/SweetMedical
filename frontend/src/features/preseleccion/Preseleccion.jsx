import { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { usePreseleccion } from "../../context/PreseleccionContext";
import ToastNotificacion from "../../components/ToastNotificacion";
import "./Preseleccion.css";
import { useSession } from "../../context/SessionContext.jsx";
import api from "../../api/api.js";

function Preseleccion() {

  const {
    turnosPreseleccionados,
    quitarTurno,
    eliminarTodos
  } = usePreseleccion();

  const { user } = useSession();

  const [toast, setToast] = useState({ show: false, mensaje: "", variant: "success" });

  const mostrarToast = (mensaje, variant = "success") => {
    setToast({ show: true, mensaje, variant });
  };

  const cerrarToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleQuitarTurno = (turno) => {
    quitarTurno(turno);
    mostrarToast("Turno eliminado", "danger");
  };

  const handleEliminarTodos = () => {
    eliminarTodos();
    mostrarToast("Todos los turnos eliminados", "danger");
  };

  const handleConfirmar = async () => {
    try {
      const body = {
        turnos: turnosPreseleccionados
      };
      await api.post("/turnos/lote", {
        turnos: turnosPreseleccionados
      });

      eliminarTodos();

      mostrarToast("Turnos reservados con éxito");

    } catch (err) {
      console.error(err);
      mostrarToast("No se pudieron reservar los turnos", "danger");
    }
  };

  const total = turnosPreseleccionados.reduce(
    (acc, t) => acc + (t.costoEstimado || 0),
    0
  );

  return (
    <div className="container py-4" id="main-content">
      <div className="page-header">
        <h1>Turnos Preseleccionados</h1>
        <h5>Turnos seleccionados: {turnosPreseleccionados.length}</h5>
        <p>Total estimado: ${total}</p>
      </div>
      

      {turnosPreseleccionados.length === 0 ? (
        <p>No hay turnos seleccionados.</p>
      ) : (
        <>
          {turnosPreseleccionados.map((turno, index) => (
            <Card key={index} className="mb-3">

            <Card.Body>
              <Card.Title>
                {turno.medicoNombre}
              </Card.Title>

              <p>
                <strong>Consulta:</strong>{" "}
                {turno.consultaSolicitada.nombre}
              </p>

              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(turno.fechaHora).toLocaleString()}
              </p>

              <p>
              <strong>Costo:</strong>{" "}
              {turno.estadoCobertura === "SIN COBERTURA"
                ? `$${turno.costoEstimado}`
                : `$${turno.costoEstimado} (${turno.porcentajeCobertura}% cubierto)`}
              </p>

              <Button
                variant="danger"
                onClick={() => handleQuitarTurno(turno)}
              >
                Eliminar
              </Button>
            </Card.Body>

            </Card>
          ))}

          <Row className="mt-4 g-2">
            <Col xs={12} sm={6}>
              <Button
                variant="danger"
                className="w-100"
                onClick={handleEliminarTodos}
              >
                Eliminar todos
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button
                variant="success"
                className="w-100"
                onClick={handleConfirmar}
              >
                Confirmar / Reservar turnos
              </Button>
            </Col>
          </Row>
        </>
      )}

      <ToastNotificacion
        show={toast.show}
        mensaje={toast.mensaje}
        variant={toast.variant}
        onClose={cerrarToast}
      />

    </div>
  );
}

export default Preseleccion;